import React, { useState } from 'react';
import { X, Share2, Twitter, Facebook, Linkedin, Flame, Target, Calendar, FileText } from 'lucide-react';

interface GoalConfirmationModalProps {
  goal: {
    title: string;
    deadline: string;
    category: string;
    description: string;
  };
  onConfirm: (shareOnSocial: boolean, selectedPlatforms: string[]) => void;
  onClose: () => void;
}

export function GoalConfirmationModal({ goal, onConfirm, onClose }: GoalConfirmationModalProps) {
  const [shareOnSocial, setShareOnSocial] = useState(false);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [isConfirming, setIsConfirming] = useState(false);

  const shareText = `私の新しい目標: ${goal.title}\n\nカテゴリー: ${goal.category}\n達成期限: ${new Date(goal.deadline).toLocaleDateString()}\n\n#Taigen #目標達成`;

  const handleShare = (platform: string) => {
    let url = '';
    const encodedText = encodeURIComponent(shareText);
    const currentUrl = window.location.href;

    switch (platform) {
      case 'twitter':
        url = `https://twitter.com/intent/tweet?text=${encodedText}&url=${currentUrl}`;
        break;
      case 'facebook':
        url = `https://www.facebook.com/sharer/sharer.php?u=${currentUrl}&quote=${encodedText}`;
        break;
      case 'linkedin':
        url = `https://www.linkedin.com/sharing/share-offsite/?url=${currentUrl}&summary=${encodedText}`;
        break;
    }

    if (url) {
      window.open(url, '_blank', 'width=600,height=400');
    }
  };

  const togglePlatform = (platform: string) => {
    if (selectedPlatforms.includes(platform)) {
      setSelectedPlatforms(selectedPlatforms.filter(p => p !== platform));
    } else {
      setSelectedPlatforms([...selectedPlatforms, platform]);
      handleShare(platform);
    }
  };

  const handleConfirm = () => {
    setIsConfirming(true);
    setTimeout(() => {
      onConfirm(shareOnSocial, selectedPlatforms);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center">
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl max-w-lg w-full mx-4 p-8 shadow-2xl border border-yellow-400/20">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-3">
            <Flame className="h-8 w-8 text-yellow-400" />
            <h2 className="text-3xl font-bold text-white">目標の宣言</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-full transition-colors text-white/60 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-6 mb-8">
          <div className="bg-white/5 rounded-lg p-4 border border-white/10 transform hover:scale-102 transition-transform">
            <div className="flex items-center space-x-3 mb-2">
              <Target className="h-5 w-5 text-yellow-400" />
              <h3 className="font-semibold text-yellow-400">目標</h3>
            </div>
            <p className="text-white text-lg font-medium pl-8">{goal.title}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
              <div className="flex items-center space-x-3 mb-2">
                <Calendar className="h-5 w-5 text-yellow-400" />
                <h3 className="font-semibold text-yellow-400">達成期限</h3>
              </div>
              <p className="text-white pl-8">{new Date(goal.deadline).toLocaleDateString()}</p>
            </div>

            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
              <div className="flex items-center space-x-3 mb-2">
                <FileText className="h-5 w-5 text-yellow-400" />
                <h3 className="font-semibold text-yellow-400">カテゴリー</h3>
              </div>
              <p className="text-white pl-8">{goal.category}</p>
            </div>
          </div>

          {goal.description && (
            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
              <div className="flex items-center space-x-3 mb-2">
                <FileText className="h-5 w-5 text-yellow-400" />
                <h3 className="font-semibold text-yellow-400">詳細説明</h3>
              </div>
              <p className="text-white/90 pl-8">{goal.description}</p>
            </div>
          )}
        </div>

        <div className="space-y-4 mb-8">
          <div className="flex items-center space-x-3 bg-white/5 rounded-lg p-4 border border-white/10">
            <input
              type="checkbox"
              id="shareOnSocial"
              checked={shareOnSocial}
              onChange={(e) => {
                setShareOnSocial(e.target.checked);
                if (!e.target.checked) {
                  setSelectedPlatforms([]);
                }
              }}
              className="w-5 h-5 rounded border-white/20 bg-white/5 checked:bg-yellow-400 focus:ring-yellow-400 focus:ring-offset-gray-900"
            />
            <label htmlFor="shareOnSocial" className="text-white font-medium">
              この目標をSNSで共有し、決意を表明する
            </label>
          </div>

          {shareOnSocial && (
            <div className="flex space-x-4 pl-12">
              <button
                onClick={() => togglePlatform('twitter')}
                className={`p-3 rounded-lg transition-all transform hover:scale-105 ${
                  selectedPlatforms.includes('twitter')
                    ? 'bg-blue-500 text-white ring-2 ring-blue-400 ring-offset-2 ring-offset-gray-900'
                    : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Twitter className="h-6 w-6" />
              </button>
              <button
                onClick={() => togglePlatform('facebook')}
                className={`p-3 rounded-lg transition-all transform hover:scale-105 ${
                  selectedPlatforms.includes('facebook')
                    ? 'bg-blue-600 text-white ring-2 ring-blue-500 ring-offset-2 ring-offset-gray-900'
                    : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Facebook className="h-6 w-6" />
              </button>
              <button
                onClick={() => togglePlatform('linkedin')}
                className={`p-3 rounded-lg transition-all transform hover:scale-105 ${
                  selectedPlatforms.includes('linkedin')
                    ? 'bg-blue-700 text-white ring-2 ring-blue-600 ring-offset-2 ring-offset-gray-900'
                    : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Linkedin className="h-6 w-6" />
              </button>
            </div>
          )}
        </div>

        <div className="flex space-x-4">
          <button
            onClick={handleConfirm}
            disabled={isConfirming}
            className={`flex-1 bg-yellow-400 text-gray-900 px-6 py-3 rounded-lg font-bold text-lg
              transition-all transform hover:scale-105 hover:bg-yellow-300 focus:outline-none focus:ring-2 
              focus:ring-yellow-400 focus:ring-offset-2 focus:ring-offset-gray-900
              flex items-center justify-center space-x-3 ${isConfirming ? 'animate-pulse' : ''}`}
          >
            <Share2 className="h-6 w-6" />
            <span>{isConfirming ? '目標を宣言中...' : '目標を宣言する'}</span>
          </button>
          <button
            onClick={onClose}
            disabled={isConfirming}
            className="flex-1 bg-white/5 text-white px-6 py-3 rounded-lg font-medium hover:bg-white/10 
              transition-all focus:outline-none focus:ring-2 focus:ring-white/20"
          >
            キャンセル
          </button>
        </div>
      </div>
    </div>
  );
}