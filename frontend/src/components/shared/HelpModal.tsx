import React, { useState } from 'react';
import { Sparkles, FileText, Palette, MessageSquare, Download, ChevronLeft, ChevronRight, ExternalLink, Settings, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Modal } from './Modal';
import { Button } from './Button';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// 结果案例数据
const showcases = [
  {
    image: 'https://github.com/user-attachments/assets/d58ce3f7-bcec-451d-a3b9-ca3c16223644',
    title: '软件开发最佳实践',
  },
  {
    image: 'https://github.com/user-attachments/assets/c64cd952-2cdf-4a92-8c34-0322cbf3de4e',
    title: 'DeepSeek-V3.2技术展示',
  },
  {
    image: 'https://github.com/user-attachments/assets/383eb011-a167-4343-99eb-e1d0568830c7',
    title: '预制菜智能产线装备研发和产业化',
  },
  {
    image: 'https://github.com/user-attachments/assets/1a63afc9-ad05-4755-8480-fc4aa64987f1',
    title: '钱的演变：从贝壳到纸币的旅程',
  },
];

// 功能介绍数据
const features = [
  {
    icon: <Sparkles className="text-yellow-500" size={24} />,
    title: '灵活多样的创作路径',
    description: '支持想法、大纲、页面描述三种起步方式，满足不同创作习惯。',
    details: [
      '一句话生成：输入一个主题，AI 自动生成结构清晰的大纲和逐页内容描述',
      '自然语言编辑：支持以 Vibe 形式口头修改大纲或描述，AI 实时响应调整',
      '大纲/描述模式：既可一键批量生成，也可手动调整细节',
    ],
  },
  {
    icon: <FileText className="text-blue-500" size={24} />,
    title: '强大的素材解析能力',
    description: '上传多种格式文件，自动解析内容，为生成提供丰富素材。',
    details: [
      '多格式支持：上传 PDF/Docx/MD/Txt 等文件，后台自动解析内容',
      '智能提取：自动识别文本中的关键点、图片链接和图表信息',
      '风格参考：支持上传参考图片或模板，定制 PPT 风格',
    ],
  },
  {
    icon: <MessageSquare className="text-green-500" size={24} />,
    title: '"Vibe" 式自然语言修改',
    description: '不再受限于复杂的菜单按钮，直接通过自然语言下达修改指令。',
    details: [
      '局部重绘：对不满意的区域进行口头式修改（如"把这个图换成饼图"）',
      '整页优化：基于 nano banana pro🍌 生成高清、风格统一的页面',
    ],
  },
  {
    icon: <Download className="text-purple-500" size={24} />,
    title: '开箱即用的格式导出',
    description: '一键导出标准格式，直接演示无需调整。',
    details: [
      '多格式支持：一键导出标准 PPTX 或 PDF 文件',
      '完美适配：默认 16:9 比例，排版无需二次调整',
    ],
  },
];

/**
 * 帮助模态框组件
 * 分页展示：引导页 → 案例展示 → 功能介绍
 */
export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(0); // 0: 引导页, 1: 案例展示, 2: 功能介绍
  const [currentShowcase, setCurrentShowcase] = useState(0);
  const [expandedFeature, setExpandedFeature] = useState<number | null>(null);

  const totalPages = 3;

  const handlePrevShowcase = () => {
    setCurrentShowcase((prev) => (prev === 0 ? showcases.length - 1 : prev - 1));
  };

  const handleNextShowcase = () => {
    setCurrentShowcase((prev) => (prev === showcases.length - 1 ? 0 : prev + 1));
  };

  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleGoToSettings = () => {
    onClose();
    navigate('/settings');
  };

  const renderGuidePage = () => (
    <div className="space-y-6">
      {/* 欢迎标题 */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center justify-center">
          <img
            src="/logo.png"
            alt="蕉幻 Logo"
            className="h-16 w-16 object-contain"
          />
        </div>
        <h3 className="text-2xl font-bold text-gray-800">欢迎使用蕉幻！</h3>
        <p className="text-sm text-gray-600">在开始前，让我们先完成基础配置</p>
      </div>

      {/* 配置步骤 */}
      <div className="space-y-4">
        {/* 步骤 1 */}
        <div className="flex gap-4 p-4 bg-gradient-to-r from-banana-50 to-orange-50 rounded-xl border border-banana-200">
          <div className="flex-shrink-0 w-8 h-8 bg-banana-500 text-white rounded-full flex items-center justify-center font-bold">
            1
          </div>
          <div className="flex-1 space-y-2">
            <h4 className="font-semibold text-gray-800">配置 API Key</h4>
            <p className="text-sm text-gray-600">
              前往设置页面，配置您的 AI 服务提供商的 API Key，包括：
            </p>
            <ul className="text-sm text-gray-600 space-y-1 pl-4">
              <li>• 文本生成模型（如 OpenAI、Anthropic、Google 等）</li>
              <li>• 图像生成模型（如 OpenAI DALL-E 等）</li>
              <li>• 图像描述模型（可选，用于图片内容识别）</li>
            </ul>
          </div>
        </div>

        {/* 步骤 2 */}
        <div className="flex gap-4 p-4 bg-white rounded-xl border border-gray-200">
          <div className="flex-shrink-0 w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold">
            2
          </div>
          <div className="flex-1 space-y-2">
            <h4 className="font-semibold text-gray-800">保存并测试</h4>
            <p className="text-sm text-gray-600">
              配置完成后，务必点击「保存设置」按钮，然后在页面底部进行服务测试，确保各项服务正常工作。
            </p>
          </div>
        </div>

        {/* 步骤 3 */}
        <div className="flex gap-4 p-4 bg-white rounded-xl border border-gray-200">
          <div className="flex-shrink-0 w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center font-bold">
            <Check size={18} />
          </div>
          <div className="flex-1 space-y-2">
            <h4 className="font-semibold text-gray-800">开始创作</h4>
            <p className="text-sm text-gray-600">
              配置成功后，返回首页即可开始使用 AI 生成精美的 PPT！
            </p>
          </div>
        </div>
      </div>

      {/* 前往设置按钮 */}
      <div className="flex justify-center pt-2">
        <Button
          onClick={handleGoToSettings}
          className="bg-banana-500 hover:bg-banana-600 text-black shadow-lg"
          icon={<Settings size={18} />}
        >
          前往设置页面
        </Button>
      </div>

      {/* 提示 */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <p className="text-xs text-blue-800">
          💡 <strong>提示</strong>：如果您还没有 API Key，可以前往对应服务商官网注册获取。配置完成后，建议先进行服务测试，避免后续使用出现问题。
        </p>
      </div>
    </div>
  );

  const renderShowcasePage = () => (
    <div className="space-y-4">
      <p className="text-sm text-gray-600 text-center">
        以下是使用蕉幻生成的 PPT 案例展示
      </p>

      {/* 轮播图 */}
      <div className="relative">
        <div className="aspect-video bg-gray-100 rounded-xl overflow-hidden shadow-lg">
          <img
            src={showcases[currentShowcase].image}
            alt={showcases[currentShowcase].title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* 左右切换按钮 */}
        <button
          onClick={handlePrevShowcase}
          className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110"
        >
          <ChevronLeft size={20} />
        </button>
        <button
          onClick={handleNextShowcase}
          className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* 案例标题 */}
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-800">
          {showcases[currentShowcase].title}
        </h3>
      </div>

      {/* 指示点 */}
      <div className="flex justify-center gap-2">
        {showcases.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentShowcase(idx)}
            className={`w-2 h-2 rounded-full transition-all ${
              idx === currentShowcase
                ? 'bg-banana-500 w-6'
                : 'bg-gray-300 hover:bg-gray-400'
            }`}
          />
        ))}
      </div>

      {/* 缩略图网格 */}
      <div className="grid grid-cols-4 gap-2 mt-4">
        {showcases.map((showcase, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentShowcase(idx)}
            className={`aspect-video rounded-lg overflow-hidden border-2 transition-all ${
              idx === currentShowcase
                ? 'border-banana-500 ring-2 ring-banana-200'
                : 'border-transparent hover:border-gray-300'
            }`}
          >
            <img
              src={showcase.image}
              alt={showcase.title}
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>

      {/* 更多案例链接 */}
      <div className="text-center pt-4">
        <a
          href="https://github.com/Anionex/banana-slides/issues/2"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-sm text-banana-600 hover:text-banana-700 font-medium"
        >
          <ExternalLink size={14} />
          查看更多使用案例
        </a>
      </div>
    </div>
  );

  const renderFeaturesPage = () => (
    <div className="space-y-3">
      {features.map((feature, idx) => (
        <div
          key={idx}
          className={`border rounded-xl transition-all cursor-pointer ${
            expandedFeature === idx
              ? 'border-banana-300 bg-banana-50/50 shadow-sm'
              : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
          }`}
          onClick={() => setExpandedFeature(expandedFeature === idx ? null : idx)}
        >
          {/* 标题行 */}
          <div className="flex items-center gap-3 p-4">
            <div className="flex-shrink-0 w-10 h-10 bg-white rounded-lg shadow-sm flex items-center justify-center">
              {feature.icon}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-base font-semibold text-gray-800">{feature.title}</h4>
              <p className="text-sm text-gray-500 truncate">{feature.description}</p>
            </div>
            <ChevronRight
              size={18}
              className={`text-gray-400 transition-transform flex-shrink-0 ${
                expandedFeature === idx ? 'rotate-90' : ''
              }`}
            />
          </div>

          {/* 展开详情 */}
          {expandedFeature === idx && (
            <div className="px-4 pb-4 pt-0">
              <div className="pl-13 space-y-2">
                {feature.details.map((detail, detailIdx) => (
                  <div key={detailIdx} className="flex items-start gap-2 text-sm text-gray-600">
                    <span className="text-banana-500 mt-1">•</span>
                    <span>{detail}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="" size="lg">
      <div className="space-y-6">
        {/* 标题区 */}
        <div className="text-center pb-4 border-b border-gray-100">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-banana-50 to-orange-50 rounded-full mb-3">
            <Palette size={18} className="text-banana-600" />
            <span className="text-sm font-medium text-gray-700">蕉幻 · Banana Slides</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-800">
            {currentPage === 0 ? '快速开始' : currentPage === 1 ? '功能介绍' : '结果案例'}
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            {currentPage === 0 ? '完成基础配置，开启 AI 创作之旅' : '探索如何使用 AI 快速创建精美 PPT'}
          </p>
        </div>

        {/* 页面指示器 */}
        <div className="flex justify-center gap-2">
          {Array.from({ length: totalPages }).map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentPage(idx)}
              className={`h-2 rounded-full transition-all ${
                idx === currentPage
                  ? 'bg-banana-500 w-8'
                  : 'bg-gray-300 hover:bg-gray-400 w-2'
              }`}
              title={idx === 0 ? '引导页' : idx === 1 ? '功能介绍' : '案例展示'}
            />
          ))}
        </div>

        {/* 内容区 */}
        <div className="min-h-[400px]">
          {currentPage === 0 && renderGuidePage()}
          {currentPage === 1 && renderFeaturesPage()}
          {currentPage === 2 && renderShowcasePage()}
        </div>

        {/* 底部导航 */}
        <div className="pt-4 border-t flex justify-between items-center">
          <div className="flex items-center gap-2">
            {currentPage > 0 && (
              <Button
                variant="ghost"
                onClick={handlePrevPage}
                icon={<ChevronLeft size={16} />}
                size="sm"
              >
                上一页
              </Button>
            )}
          </div>

          <a
            href="https://github.com/Anionex/banana-slides"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1"
          >
            <ExternalLink size={14} />
            GitHub 仓库
          </a>

          <div className="flex items-center gap-2">
            {currentPage < totalPages - 1 ? (
              <Button
                onClick={handleNextPage}
                icon={<ChevronRight size={16} />}
                size="sm"
                className="bg-banana-500 hover:bg-banana-600 text-black"
              >
                下一页
              </Button>
            ) : (
              <Button variant="ghost" onClick={onClose} size="sm">
                关闭
              </Button>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};
