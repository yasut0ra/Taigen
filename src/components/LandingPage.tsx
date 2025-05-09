import React from 'react';
import { Flame, Rocket, Target, Users, Trophy, ArrowRight, Star, TrendingUp, Sparkles } from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
  onLearnMore: () => void;
}

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description }) => (
  <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 hover:transform hover:scale-105 transition-all duration-300">
    <div className="text-yellow-400 mb-4">{icon}</div>
    <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
    <p className="text-white/80">{description}</p>
  </div>
);

const features = [
  {
    icon: <Target className="h-8 w-8" />,
    title: "目標設定の力",
    description: "具体的で明確な目標設定により、あなたの夢への道筋が見えてきます。"
  },
  {
    icon: <Users className="h-8 w-8" />,
    title: "コミュニティの力",
    description: "仲間からの応援とサポートが、目標達成への原動力となります。"
  },
  {
    icon: <TrendingUp className="h-8 w-8" />,
    title: "進捗管理の力",
    description: "マイルストーンと進捗管理で、着実な前進を実感できます。"
  }
];

const testimonials = [
  {
    name: "田中 美咲",
    role: "起業家",
    content: "Taigenのおかげで、起業という大きな目標に向かって着実に進むことができました。",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120&h=120"
  },
  {
    name: "鈴木 健一",
    role: "マラソンランナー",
    content: "フルマラソン完走という目標を掲げ、多くの人の応援を受けながら達成できました。",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120&h=120"
  }
];

export function LandingPage({ onGetStarted, onLearnMore }: LandingPageProps) {
  const scrollToFeatures = () => {
    const featuresSection = document.querySelector('#features');
    featuresSection?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="space-y-24 py-12">
      {/* ヒーローセクション */}
      <section className="text-center max-w-4xl mx-auto px-4">
        <div className="inline-flex items-center bg-white/10 backdrop-blur-md rounded-full px-4 py-2 mb-8">
          <Star className="h-5 w-5 text-yellow-400 mr-2" />
          <span className="text-white">目標達成をサポートする新しいプラットフォーム</span>
        </div>
        <h1 className="text-5xl font-bold text-white mb-6 leading-tight">
          大きな目標を掲げ、<br />
          仲間と共に達成する
        </h1>
        <p className="text-xl text-white/80 mb-8">
          Taigenは、あなたの大きな目標の実現をサポートします。<br />
          目標を宣言し、進捗を共有し、仲間からの応援を受けながら、<br />
          一歩一歩、確実に前進しましょう。
        </p>
        <div className="flex items-center justify-center space-x-4">
          <button 
            onClick={onGetStarted}
            className="bg-yellow-400 text-gray-900 px-8 py-3 rounded-full font-semibold flex items-center hover:bg-yellow-300 transition-colors"
          >
            今すぐ始める
            <ArrowRight className="ml-2 h-5 w-5" />
          </button>
          <button 
            onClick={scrollToFeatures}
            className="bg-white/10 backdrop-blur-md text-white px-8 py-3 rounded-full font-semibold hover:bg-white/20 transition-colors"
          >
            詳しく見る
          </button>
        </div>
      </section>

      {/* 統計セクション */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6">
            <div className="text-4xl font-bold text-white mb-2">10,000+</div>
            <div className="text-white/80">目標が宣言されました</div>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6">
            <div className="text-4xl font-bold text-white mb-2">85%</div>
            <div className="text-white/80">の目標が達成されています</div>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6">
            <div className="text-4xl font-bold text-white mb-2">50,000+</div>
            <div className="text-white/80">の応援メッセージ</div>
          </div>
        </div>
      </section>

      {/* 特徴セクション */}
      <section id="features" className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">
            目標達成のための3つの力
          </h2>
          <p className="text-white/80">
            Taigenは、あなたの目標達成を3つの重要な要素でサポートします
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </div>
      </section>

      {/* 使い方セクション */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">
            簡単3ステップで始められます
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 relative">
            <div className="absolute -top-4 -left-4 bg-yellow-400 text-gray-900 w-8 h-8 rounded-full flex items-center justify-center font-bold">1</div>
            <Rocket className="h-8 w-8 text-yellow-400 mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">目標を宣言</h3>
            <p className="text-white/80">あなたの大きな目標を設定し、公言することで決意を固めます。</p>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 relative">
            <div className="absolute -top-4 -left-4 bg-yellow-400 text-gray-900 w-8 h-8 rounded-full flex items-center justify-center font-bold">2</div>
            <Target className="h-8 w-8 text-yellow-400 mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">マイルストーン設定</h3>
            <p className="text-white/80">大きな目標を小さな達成可能な目標に分割します。</p>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 relative">
            <div className="absolute -top-4 -left-4 bg-yellow-400 text-gray-900 w-8 h-8 rounded-full flex items-center justify-center font-bold">3</div>
            <Users className="h-8 w-8 text-yellow-400 mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">進捗共有</h3>
            <p className="text-white/80">進捗を共有し、仲間からの応援を受けながら前進します。</p>
          </div>
        </div>
      </section>

      {/* 体験談セクション */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">
            目標達成者の声
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white/10 backdrop-blur-md rounded-xl p-6">
              <div className="flex items-center mb-4">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full mr-4"
                />
                <div>
                  <div className="font-semibold text-white">{testimonial.name}</div>
                  <div className="text-white/60 text-sm">{testimonial.role}</div>
                </div>
              </div>
              <p className="text-white/80">{testimonial.content}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTAセクション */}
      <section className="max-w-4xl mx-auto px-4 text-center">
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-12">
          <Sparkles className="h-12 w-12 text-yellow-400 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-white mb-4">
            あなたの目標達成の旅を始めましょう
          </h2>
          <p className="text-white/80 mb-8">
            今日から、あなたの大きな目標への第一歩を踏み出しませんか？
          </p>
          <button 
            onClick={onGetStarted}
            className="bg-yellow-400 text-gray-900 px-8 py-3 rounded-full font-semibold flex items-center mx-auto hover:bg-yellow-300 transition-colors"
          >
            無料で始める
            <ArrowRight className="ml-2 h-5 w-5" />
          </button>
        </div>
      </section>
    </div>
  );
}