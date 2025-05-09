import React, { useState, useEffect } from 'react';
import { Flame, Rocket, Share2, Trophy, Users, Sparkles, Twitter, Facebook, Linkedin, MessageSquarePlus, X, ChevronRight, ChevronLeft, Target, Calendar, CheckCircle2, Clock, BarChart3, User, Plus, CalendarDays, LogOut, Mountain, Flag, Star } from 'lucide-react';
import { supabase } from './lib/supabase';
import { AuthModal } from './components/AuthModal';
import { LandingPage } from './components/LandingPage';
import { GoalConfirmationModal } from './components/GoalConfirmationModal';
import type { Goal, Milestone, ProgressUpdate } from './types/database';

// カテゴリーの選択肢
const categories = [
  "キャリア",
  "学習・教育",
  "健康・フィットネス",
  "ビジネス・起業",
  "趣味・特技",
  "社会貢献",
  "その他"
];

function App() {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showMyPage, setShowMyPage] = useState(false);
  const [user, setUser] = useState(null);
  const [goal, setGoal] = useState('');
  const [goalDeadline, setGoalDeadline] = useState('');
  const [goalCategory, setGoalCategory] = useState('');
  const [goalDescription, setGoalDescription] = useState('');
  const [showProgressModal, setShowProgressModal] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [newProgress, setNewProgress] = useState(0);
  const [progressNote, setProgressNote] = useState('');
  const [showMilestoneModal, setShowMilestoneModal] = useState(false);
  const [newMilestone, setNewMilestone] = useState('');
  const [myGoals, setMyGoals] = useState<Goal[]>([]);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);

  // 最小の締切日を今日に設定
  const minDeadline = new Date().toISOString().split('T')[0];

  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchGoals(session.user.id);
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchGoals(session.user.id);
      } else {
        setMyGoals([]);
        setShowMyPage(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchGoals = async (userId: string) => {
    try {
      const { data: goals, error } = await supabase
        .from('goals')
        .select(`
          *,
          milestones (*)
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMyGoals(goals || []);
    } catch (error) {
      console.error('Error fetching goals:', error);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const handleGetStarted = () => {
    setShowAuthModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!goal || !goalDeadline || !goalCategory || !user) {
      alert('目標、期限、カテゴリーは必須項目です');
      return;
    }

    setShowConfirmationModal(true);
  };

  const handleConfirmGoal = async (shareOnSocial: boolean, selectedPlatforms: string[]) => {
    try {
      const { data, error } = await supabase
        .from('goals')
        .insert([
          {
            user_id: user.id,
            title: goal,
            description: goalDescription,
            deadline: goalDeadline,
            category: goalCategory,
            progress: 0,
            status: 'progress'
          },
        ])
        .select()
        .single();

      if (error) throw error;

      setMyGoals([data, ...myGoals]);
      setGoal('');
      setGoalDeadline('');
      setGoalCategory('');
      setGoalDescription('');
      setShowConfirmationModal(false);
      setShowMyPage(true);

      // ここでSNS共有の処理を実装
      if (shareOnSocial) {
        // SNS共有の実装（実際のSNS APIとの連携が必要）
        console.log('Share on:', selectedPlatforms);
      }
    } catch (error) {
      console.error('Error creating goal:', error);
      alert('目標の作成中にエラーが発生しました');
    }
  };

  const handleProgressUpdate = async (goalId: string) => {
    try {
      const { error: progressError } = await supabase
        .from('progress_updates')
        .insert([
          {
            goal_id: goalId,
            progress: newProgress,
            note: progressNote,
          },
        ]);

      if (progressError) throw progressError;

      const { error: goalError } = await supabase
        .from('goals')
        .update({ 
          progress: newProgress,
          status: newProgress === 100 ? 'completed' : 'progress'
        })
        .eq('id', goalId);

      if (goalError) throw goalError;

      setMyGoals(
        myGoals.map((g) =>
          g.id === goalId ? { 
            ...g, 
            progress: newProgress,
            status: newProgress === 100 ? 'completed' : 'progress'
          } : g
        )
      );
      setShowProgressModal(false);
      setNewProgress(0);
      setProgressNote('');
    } catch (error) {
      console.error('Error updating progress:', error);
      alert('進捗の更新中にエラーが発生しました');
    }
  };

  const handleAddMilestone = async (goalId: string) => {
    if (!newMilestone.trim()) return;

    try {
      const { data, error } = await supabase
        .from('milestones')
        .insert([
          {
            goal_id: goalId,
            title: newMilestone,
            completed: false
          },
        ])
        .select()
        .single();

      if (error) throw error;

      setMyGoals(
        myGoals.map((g) =>
          g.id === goalId
            ? {
                ...g,
                milestones: [...(g.milestones || []), data],
              }
            : g
        )
      );
      setNewMilestone('');
      setShowMilestoneModal(false);
    } catch (error) {
      console.error('Error adding milestone:', error);
      alert('マイルストーンの追加中にエラーが発生しました');
    }
  };

  const toggleMilestoneCompletion = async (goalId: string, milestoneId: string) => {
    try {
      const milestone = myGoals
        .find((g) => g.id === goalId)
        ?.milestones?.find((m) => m.id === milestoneId);

      if (!milestone) return;

      const { error } = await supabase
        .from('milestones')
        .update({ completed: !milestone.completed })
        .eq('id', milestoneId);

      if (error) throw error;

      setMyGoals(
        myGoals.map((g) =>
          g.id === goalId
            ? {
                ...g,
                milestones: g.milestones?.map((m) =>
                  m.id === milestoneId
                    ? { ...m, completed: !m.completed }
                    : m
                ),
              }
            : g
        )
      );
    } catch (error) {
      console.error('Error toggling milestone:', error);
      alert('マイルストーンの更新中にエラーが発生しました');
    }
  };

  const renderGoalForm = () => (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <div className="inline-flex items-center bg-white/10 backdrop-blur-md rounded-full px-6 py-2 mb-4">
          <Star className="h-5 w-5 text-yellow-400 mr-2" />
          <span className="text-white font-medium">新しい目標を設定する</span>
        </div>
        <h1 className="text-4xl font-bold text-white mb-4">
          あなたの大きな目標を宣言しよう
        </h1>
        <p className="text-lg text-white/80">
          目標を明確にし、決意を固めることで、<br />
          その実現への第一歩を踏み出すことができます。
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 shadow-xl border border-white/20">
          <div className="space-y-6">
            <div>
              <label className="block text-lg font-medium text-white mb-2 flex items-center">
                <Target className="h-5 w-5 text-yellow-400 mr-2" />
                目標
              </label>
              <textarea
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                placeholder="例: プログラミングスキルを活かして、自分のWebサービスを開発・リリースする"
                className="w-full h-32 px-6 py-4 bg-white/5 border border-white/20 rounded-xl text-white placeholder-white/40 focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-lg"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-lg font-medium text-white mb-2 flex items-center">
                  <Calendar className="h-5 w-5 text-yellow-400 mr-2" />
                  達成期限
                </label>
                <div className="flex items-center space-x-2 bg-white/5 border border-white/20 rounded-xl px-6 py-4">
                  <CalendarDays className="h-5 w-5 text-white/40" />
                  <input
                    type="date"
                    value={goalDeadline}
                    onChange={(e) => setGoalDeadline(e.target.value)}
                    min={minDeadline}
                    className="bg-transparent text-white focus:outline-none focus:ring-0 flex-1 text-lg"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-lg font-medium text-white mb-2 flex items-center">
                  <Flag className="h-5 w-5 text-yellow-400 mr-2" />
                  カテゴリー
                </label>
                <select
                  value={goalCategory}
                  onChange={(e) => setGoalCategory(e.target.value)}
                  className="w-full bg-white/5 border border-white/20 rounded-xl px-6 py-4 text-white focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-lg"
                  required
                >
                  <option value="" className="bg-gray-900">カテゴリーを選択</option>
                  {categories.map(category => (
                    <option
                      key={category}
                      value={category}
                      className="bg-gray-900"
                    >
                      {category}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-lg font-medium text-white mb-2 flex items-center">
                <MessageSquarePlus className="h-5 w-5 text-yellow-400 mr-2" />
                詳細説明
              </label>
              <textarea
                value={goalDescription}
                onChange={(e) => setGoalDescription(e.target.value)}
                placeholder="目標達成後のビジョンや、目標に込めた想いを書いてみましょう..."
                className="w-full h-40 px-6 py-4 bg-white/5 border border-white/20 rounded-xl text-white placeholder-white/40 focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-lg"
              />
            </div>
          </div>

          <div className="mt-8">
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 px-8 py-4 rounded-xl 
                font-bold text-xl flex items-center justify-center space-x-3 hover:from-yellow-300 hover:to-yellow-400 
                transform hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 
                focus:ring-yellow-400 focus:ring-offset-2 focus:ring-offset-gray-900"
            >
              <Mountain className="h-6 w-6" />
              <span>目標を宣言する</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );

  const renderMyPage = () => (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-white">マイページ</h2>
        <div className="flex space-x-4">
          <div className="bg-white/10 backdrop-blur-md rounded-lg px-4 py-2 text-white">
            <div className="text-sm">総目標数</div>
            <div className="text-2xl font-bold">{myGoals.length}</div>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-lg px-4 py-2 text-white">
            <div className="text-sm">達成数</div>
            <div className="text-2xl font-bold">
              {myGoals.filter(g => g.status === 'completed').length}
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6">
        {myGoals.map(goal => (
          <div key={goal.id} className="bg-white/10 backdrop-blur-md rounded-lg p-6 text-white">
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-xl font-semibold flex-1 mr-4">{goal.title}</h3>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                goal.status === 'completed' 
                  ? 'bg-green-400 text-gray-900' 
                  : 'bg-yellow-400 text-gray-900'
              }`}>
                {goal.status === 'completed' ? '達成' : '進行中'}
              </span>
            </div>
            
            <div className="mb-4">
              <div className="flex justify-between text-sm mb-1">
                <span>進捗状況</span>
                <span>{goal.progress}%</span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${
                    goal.status === 'completed'
                      ? 'bg-green-400'
                      : 'bg-yellow-400'
                  }`}
                  style={{ width: `${goal.progress}%` }}
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 text-sm mb-4">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-yellow-400" />
                <span>期限: {new Date(goal.deadline).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Target className="h-4 w-4 text-yellow-400" />
                <span>カテゴリー: {goal.category}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-yellow-400" />
                <span>作成: {new Date(goal.created_at).toLocaleDateString()}</span>
              </div>
            </div>

            {goal.description && (
              <p className="text-white/80 mb-4 text-sm">
                {goal.description}
              </p>
            )}

            <div className="space-y-2">
              <h4 className="font-semibold flex items-center">
                <Target className="h-4 w-4 mr-2 text-yellow-400" />
                マイルストーン
              </h4>
              <ul className="space-y-2">
                {goal.milestones?.map(milestone => (
                  <li
                    key={milestone.id}
                    className="flex items-center space-x-2 text-sm"
                  >
                    <button
                      onClick={() => toggleMilestoneCompletion(goal.id, milestone.id)}
                      className={`p-1 rounded-full transition-colors ${
                        milestone.completed
                          ? 'bg-green-400 text-gray-900'
                          : 'bg-white/10 text-white'
                      }`}
                    >
                      <CheckCircle2 className="h-4 w-4" />
                    </button>
                    <span className={milestone.completed ? 'line-through text-white/50' : ''}>
                      {milestone.title}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-4 flex space-x-4">
              <button
                onClick={() => {
                  setSelectedGoal(goal);
                  setShowProgressModal(true);
                }}
                className="flex items-center space-x-2 text-yellow-400 hover:text-yellow-300 transition-colors"
              >
                <BarChart3 className="h-4 w-4" />
                <span>進捗を更新</span>
              </button>
              <button
                onClick={() => {
                  setSelectedGoal(goal);
                  setShowMilestoneModal(true);
                }}
                className="flex items-center space-x-2 text-yellow-400 hover:text-yellow-300 transition-colors"
              >
                <Plus className="h-4 w-4" />
                <span>マイルストーンを追加</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 to-purple-700">
      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
      {showConfirmationModal && (
        <GoalConfirmationModal
          goal={{
            title: goal,
            deadline: goalDeadline,
            category: goalCategory,
            description: goalDescription
          }}
          onConfirm={handleConfirmGoal}
          onClose={() => setShowConfirmationModal(false)}
        />
      )}

      <nav className="bg-white/10 backdrop-blur-md border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Flame className="h-8 w-8 text-yellow-400" />
              <span className="ml-2 text-2xl font-bold text-white">Taigen</span>
            </div>
            <div className="flex items-center space-x-4">
              {user ? (
                <>
                  <button
                    onClick={() => setShowMyPage(!showMyPage)}
                    className="flex items-center space-x-2 text-white hover:text-yellow-400 transition-colors"
                  >
                    <User className="h-5 w-5" />
                    <span>{showMyPage ? '目標を追加' : 'マイページ'}</span>
                  </button>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 text-white hover:text-yellow-400 transition-colors"
                  >
                    <LogOut className="h-5 w-5" />
                    <span>ログアウト</span>
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="flex items-center space-x-2 text-white hover:text-yellow-400 transition-colors"
                >
                  <User className="h-5 w-5" />
                  <span>ログイン</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {user ? (
          showMyPage ? renderMyPage() : renderGoalForm()
        ) : (
          <LandingPage 
            onGetStarted={handleGetStarted}
            onLearnMore={() => {}}
          />
        )}
      </main>

      {/* 進捗更新モーダル */}
      {showProgressModal && selectedGoal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white rounded-xl max-w-md w-full mx-4 p-6">
            <h3 className="text-xl font-bold mb-4">進捗を更新</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  進捗率 (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={newProgress}
                  onChange={(e) => setNewProgress(Number(e.target.value))}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  進捗メモ
                </label>
                <textarea
                  value={progressNote}
                  onChange={(e) => setProgressNote(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                  rows={3}
                />
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => handleProgressUpdate(selectedGoal.id)}
                  className="flex-1 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  更新
                </button>
                <button
                  onClick={() => setShowProgressModal(false)}
                  className="flex-1 bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  キャンセル
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* マイルストーン追加モーダル */}
      {showMilestoneModal && selectedGoal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white rounded-xl max-w-md w-full mx-4 p-6">
            <h3 className="text-xl font-bold mb-4">マイルストーンを追加</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  マイルストーン
                </label>
                <input
                  type="text"
                  value={newMilestone}
                  onChange={(e) => setNewMilestone(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                  placeholder="例: 企画書の作成"
                />
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => handleAddMilestone(selectedGoal.id)}
                  className="flex-1 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  追加
                </button>
                <button
                  onClick={() => setShowMilestoneModal(false)}
                  className="flex-1 bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  キャンセル
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;