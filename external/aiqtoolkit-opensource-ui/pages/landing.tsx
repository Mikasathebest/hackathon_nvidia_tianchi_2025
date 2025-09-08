import { GetServerSideProps } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';

const Landing = () => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleGetStarted = () => {
    router.push('/chat');
  };

  if (!mounted) {
    return null;
  }

  return (
    <>
      <Head>
        <title>医疗分析系统 - AI 驱动的智能医疗助手</title>
        <meta name="description" content="专业的AI医疗分析系统，提供智能诊断辅助和医疗数据分析服务" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/doc_icon.png" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
        {/* Navigation */}
        <nav className="relative z-10 px-6 py-4">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">医</span>
              </div>
              <span className="font-semibold text-gray-900 text-lg">医疗分析系统</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-600 hover:text-gray-900 transition-colors">功能特色</a>
              <a href="#about" className="text-gray-600 hover:text-gray-900 transition-colors">关于我们</a>
              <a href="#contact" className="text-gray-600 hover:text-gray-900 transition-colors">联系方式</a>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <main className="relative">
          {/* Background Elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
            <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-purple-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse animation-delay-2000"></div>
            <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-pink-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse animation-delay-4000"></div>
          </div>

          {/* Main Content */}
          <div className="relative z-10 max-w-7xl mx-auto px-6 py-20">
            <div className="text-center">
              {/* Main Heading */}
              <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-8 leading-tight">
                <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">
                  智能医疗
                </span>
                <br />
                <span className="text-gray-900">分析系统</span>
              </h1>

              {/* Subtitle */}
              <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
                基于人工智能的专业医疗数据分析平台
                <br />
                <span className="text-lg text-gray-500">为医疗专业人员提供智能诊断辅助和数据洞察</span>
              </p>

              {/* Get Started Button */}
              <div className="mb-16">
                <button
                  onClick={handleGetStarted}
                  className="group relative inline-flex items-center justify-center px-12 py-4 text-lg font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-700 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 ease-out"
                >
                  <span className="relative z-10">开始使用</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-blue-800 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <svg 
                    className="ml-3 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </button>
              </div>

              {/* Features Grid */}
              <div id="features" className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-20">
                <div className="group glass-effect rounded-3xl p-8 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:-translate-y-3 border border-white/20">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">智能诊断辅助</h3>
                  <p className="text-gray-600 leading-relaxed">基于深度学习算法，提供准确的医疗影像分析和诊断建议，辅助医生做出更精准的判断。</p>
                </div>

                <div className="group glass-effect rounded-3xl p-8 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:-translate-y-3 border border-white/20">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">数据分析洞察</h3>
                  <p className="text-gray-600 leading-relaxed">强大的数据处理能力，快速分析海量医疗数据，发现隐藏的模式和趋势。</p>
                </div>

                <div className="group glass-effect rounded-3xl p-8 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:-translate-y-3 border border-white/20">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">安全可靠</h3>
                  <p className="text-gray-600 leading-relaxed">符合医疗数据安全标准，采用端到端加密技术，确保患者隐私和数据安全。</p>
                </div>
              </div>

              {/* About Section */}
              <div id="about" className="glass-effect rounded-3xl p-12 max-w-4xl mx-auto mb-20 border border-white/20 shadow-2xl">
                <h2 className="text-3xl font-bold text-gray-900 mb-8">关于我们的技术</h2>
                <div className="text-left space-y-6 text-gray-700 leading-relaxed">
                  <p className="text-lg">
                    我们的医疗分析系统集成了最新的人工智能技术，包括自然语言处理、计算机视觉和机器学习算法。
                    系统能够处理多种类型的医疗数据，包括医学影像、实验室报告、病历文档等。
                  </p>
                  <div className="grid md:grid-cols-2 gap-8 mt-8">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">核心功能：</h4>
                      <ul className="space-y-2 text-gray-600">
                        <li>• 医学影像智能识别与分析</li>
                        <li>• 病历文档自动化处理</li>
                        <li>• 实验室数据趋势分析</li>
                        <li>• 个性化治疗方案推荐</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">技术优势：</h4>
                      <ul className="space-y-2 text-gray-600">
                        <li>• 99.5% 的诊断准确率</li>
                        <li>• 毫秒级响应速度</li>
                        <li>• 支持多种文件格式</li>
                        <li>• 24/7 全天候服务</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer id="contact" className="bg-gray-900 text-white py-16">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center">
              <div className="flex items-center justify-center space-x-2 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">医</span>
                </div>
                <span className="font-semibold text-xl">医疗分析系统</span>
              </div>
              <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
                致力于通过人工智能技术提升医疗服务质量，为医疗专业人员和患者提供更好的医疗体验。
              </p>
              <div className="border-t border-gray-800 pt-8">
                <p className="text-gray-500 text-sm">
                  © 2024 医疗分析系统. 保留所有权利. | 
                  <a href="#" className="hover:text-white transition-colors ml-2">隐私政策</a> | 
                  <a href="#" className="hover:text-white transition-colors ml-2">服务条款</a>
                </p>
              </div>
            </div>
          </div>
        </footer>
      </div>

      <style jsx>{`
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        
        /* Apple-like smooth scrolling */
        html {
          scroll-behavior: smooth;
        }
        
        /* Enhanced backdrop blur for better Apple aesthetic */
        .backdrop-blur-sm {
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
        }
        
        /* Subtle hover animations */
        .group:hover .group-hover\\:scale-110 {
          transform: scale(1.1);
        }
        
        /* Smooth gradient transitions */
        .bg-gradient-to-r {
          background-size: 200% 200%;
          animation: gradient-shift 6s ease infinite;
        }
        
        @keyframes gradient-shift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        /* Apple-like button press effect */
        button:active {
          transform: scale(0.98);
        }
        
        /* Enhanced glass morphism effect */
        .glass-effect {
          background: rgba(255, 255, 255, 0.25);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.18);
        }
      `}</style>
    </>
  );
};

export default Landing;

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? 'en', [
        'common',
        'chat',
        'sidebar',
        'markdown',
        'promptbar',
        'settings',
      ])),
    },
  };
};
