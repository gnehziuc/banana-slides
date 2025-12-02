"""
Material Controller - handles standalone material image generation
"""
from flask import Blueprint, request, current_app
from models import db, Project
from utils import success_response, error_response, not_found, bad_request
from services import AIService, FileService
from pathlib import Path
from werkzeug.utils import secure_filename
import tempfile
import shutil


material_bp = Blueprint('materials', __name__, url_prefix='/api/projects')


@material_bp.route('/<project_id>/materials/generate', methods=['POST'])
def generate_material_image(project_id):
    """
    POST /api/projects/{project_id}/materials/generate - Generate a standalone material image

    支持 multipart/form-data：
    - prompt: 文生图提示词（将被直接传给模型，不做任何修饰）
    - ref_image: 主参考图（可选）
    - extra_images: 额外参考图（可多文件，可选）
    """
    try:
        project = Project.query.get(project_id)
        if not project:
            return not_found('Project')

        # 解析请求数据（优先支持 multipart，用于文件上传）
        if request.is_json:
            data = request.get_json() or {}
            prompt = data.get('prompt', '').strip()
            ref_file = None
            extra_files = []
        else:
            data = request.form.to_dict()
            prompt = (data.get('prompt') or '').strip()
            ref_file = request.files.get('ref_image')
            # 支持多张额外参考图
            extra_files = request.files.getlist('extra_images') or []

        if not prompt:
            return bad_request("prompt is required")

        # 初始化服务
        ai_service = AIService(
            current_app.config['GOOGLE_API_KEY'],
            current_app.config['GOOGLE_API_BASE']
        )
        file_service = FileService(current_app.config['UPLOAD_FOLDER'])

        temp_dir = Path(tempfile.mkdtemp(dir=current_app.config['UPLOAD_FOLDER']))

        try:
            ref_path = None
            # 如果提供了主参考图，则保存到临时目录
            if ref_file and ref_file.filename:
                ref_filename = secure_filename(ref_file.filename or 'ref.png')
                ref_path = temp_dir / ref_filename
                ref_file.save(str(ref_path))

            # 保存额外参考图到临时目录
            additional_ref_images = []
            for extra in extra_files:
                if not extra or not extra.filename:
                    continue
                extra_filename = secure_filename(extra.filename)
                extra_path = temp_dir / extra_filename
                extra.save(str(extra_path))
                additional_ref_images.append(str(extra_path))

            # 使用用户原始 prompt 直接调用文生图模型（主参考图可选）
            image = ai_service.generate_image(
                prompt=prompt,
                ref_image_path=str(ref_path) if ref_path else None,
                aspect_ratio=current_app.config['DEFAULT_ASPECT_RATIO'],
                resolution=current_app.config['DEFAULT_RESOLUTION'],
                additional_ref_images=additional_ref_images or None,
            )

            if not image:
                return error_response('AI_SERVICE_ERROR', 'Failed to generate image', 503)

            # 保存生成的素材图片
            relative_path = file_service.save_material_image(image, project_id)
            # relative_path 形如 "<project_id>/materials/xxx.png"
            relative = Path(relative_path)
            # materials 目录下的文件名
            filename = relative.name

            # 构造前端可访问的 URL
            image_url = file_service.get_file_url(project_id, 'materials', filename)

            # 不改变项目结构，仅更新时间以便前端刷新
            project.updated_at = project.updated_at  # 不强制变更，仅保持兼容
            db.session.commit()

            return success_response({
                "image_url": image_url,
                "relative_path": relative_path,
            })
        finally:
            # 清理临时目录
            if temp_dir.exists():
                shutil.rmtree(temp_dir, ignore_errors=True)

    except Exception as e:
        db.session.rollback()
        return error_response('AI_SERVICE_ERROR', str(e), 503)


