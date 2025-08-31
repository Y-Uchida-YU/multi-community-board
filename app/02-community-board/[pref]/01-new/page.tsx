'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { supabase } from '../../../../lib/supabaseClient';

export default function NewPostPage() {
  const { pref } = useParams() as { pref: string };
  const decodedPref = decodeURIComponent(pref);
  const router = useRouter();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [profile, setProfile] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [lineId, setLineId] = useState('');
  const [kakaoId, setKakaoId] = useState('');
  const [free, setFree] = useState('');
  const [deleteKey, setDeleteKey] = useState('');
  const [captcha, setCaptcha] = useState('');
  const [captchaInput, setCaptchaInput] = useState('');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const generateCaptcha = () => {
    const newCaptcha = Math.floor(10000 + Math.random() * 90000).toString();
    setCaptcha(newCaptcha);
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#f0f0f0';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < 5; i++) {
          ctx.strokeStyle = `rgb(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255})`;
          ctx.beginPath();
          ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height);
          ctx.lineTo(Math.random() * canvas.width, Math.random() * canvas.height);
          ctx.stroke();
        }
        ctx.font = '24px sans-serif';
        for (let i = 0; i < newCaptcha.length; i++) {
          const char = newCaptcha[i];
          const x = 10 + i * 20 + Math.random() * 5;
          const y = 25 + Math.random() * 5;
          const angle = ((Math.random() * 30) - 15) * (Math.PI / 180);
          ctx.save();
          ctx.translate(x, y);
          ctx.rotate(angle);
          ctx.fillStyle = 'black';
          ctx.fillText(char, 0, 0);
          ctx.restore();
        }
      }
    }
  };

  useEffect(() => {
    generateCaptcha();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim() || !deleteKey.trim() || !captchaInput.trim()) {
      alert('題名・内容・削除キー・認証キーは必須です');
      return;
    }
    if (captchaInput !== captcha) {
      alert('認証キーが正しくありません');
      generateCaptcha();
      return;
    }
    const { error } = await supabase
      .from('TBL_T_POSTS')
      .insert({
        prefecture: decodedPref,
        name: name || null,
        email: email || null,
        profile: profile || null,
        title,
        content,
        line_id: lineId || null,
        kakao_id: kakaoId || null,
        free: free || null,
        delete_key: deleteKey,
        insert_program: 'frontend',
      });
    if (error) {
      alert(`投稿に失敗しました: ${error.message}`);
    } else {
      router.push(`/02-community-board/${pref}`);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-xl md:text-2xl font-semibold mb-4 text-gray-800">
        「{decodedPref}」に新規投稿
      </h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <label htmlFor='name' className='block mb-1 font-medium text-gray-700'>
          名前(必須)
        </label>
        <input
          type="text"
          placeholder="山田 太郎"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded text-gray-700 bg-gray-50"
        />
        <label htmlFor='email' className='block mb-1 font-medium text-gray-700'>
          メールアドレス(必須)
        </label>
        <input
          type="email"
          placeholder="boysmatching@icloud.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded text-gray-700 bg-gray-50"
        />
        <label htmlFor='email' className='block mb-1 font-medium text-gray-700'>
          プロフィール(必須)
        </label>
        <textarea
          placeholder="170cm 70kg 20歳 (P:16cm)"
          value={profile}
          onChange={(e) => setProfile(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded text-gray-700 bg-gray-50"
        />
        <label htmlFor='title' className='block mb-1 font-medium text-gray-700'>
          題名(必須)
        </label>
        <input
          type="text"
          placeholder="素敵な出会いを求めています。"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-full p-2 border border-gray-300 rounded text-gray-700 bg-gray-50"
        />
        <label htmlFor='Post' className='block mb-1 font-medium text-gray-700'>
          内容(必須)
        </label>
        <textarea
          placeholder="〇〇区に住んでいる××です。素敵な出会いを求めて始めました、メールをお待ちしています。"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          className="w-full p-2 border border-gray-300 rounded text-gray-700 bg-gray-50 h-24"
        />
        <label htmlFor='lineId' className='block mb-1 font-medium text-gray-700'>
          LINE ID
        </label>
        <input
          type="text"
          placeholder="line123"
          value={lineId}
          onChange={(e) => setLineId(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded text-gray-700 bg-gray-50"
        />
        <label htmlFor='kakaoId' className='block mb-1 font-medium text-gray-700'>
          Kakao ID
        </label>
        <input
          type="text"
          placeholder="kakao123"
          value={kakaoId}
          onChange={(e) => setKakaoId(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded text-gray-700 bg-gray-50"
        />
        <label htmlFor='free' className='block mb-1 font-medium text-gray-700'>
          フリーテキスト
        </label>
        <textarea
          placeholder="自由にご記入ください"
          value={free}
          onChange={(e) => setFree(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded text-gray-700 bg-gray-50 h-24"
        />
        <label htmlFor='email' className='block mb-1 font-medium text-gray-700'>
          削除キー(必須)　※投稿の削除に必用なキー設定
        </label>
        <input
          type="password"
          placeholder="99999"
          value={deleteKey}
          onChange={(e) => setDeleteKey(e.target.value)}
          required
          className="w-full p-2 border border-gray-300 rounded text-gray-700 bg-gray-50"
        />
        <label htmlFor='captcha' className='block mb-1 font-medium text-gray-700'>
          認証キー(必須)
        </label>
        <div className='flex items-center space-x-2'>
          <canvas ref={canvasRef} width={120} height={40} className='border bg-white' />
          <button
            type='button'
            onClick={generateCaptcha}
            className='px-2 py-1 bg-gray-200 text-gray-700 rounded'
          >
            再生成
          </button>
        </div>
        <input
          type='text'
          value={captchaInput}
          onChange={(e) => setCaptchaInput(e.target.value)}
          required
          className='w-full p-2 border border-gray-300 rounded text-gray-700 bg-gray-50'
        />
        <div className="flex space-x-2">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded hover:bg-gray-100"
          >
            キャンセル
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            投稿する
          </button>
        </div>
      </form>
    </div>
  );
}
