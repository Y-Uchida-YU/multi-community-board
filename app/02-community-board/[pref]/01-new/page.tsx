'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
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
  const [deleteKey, setDeleteKey] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim() || !deleteKey.trim()) {
      alert('題名・内容・削除キーは必須です');
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
    <main className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">
        「{decodedPref}」に新規投稿
      </h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <label htmlFor='name' className='block mb-1 font-medium'>
          名前(必須)
        </label>
        <input
          type="text"
          placeholder="山田 太郎"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <label htmlFor='email' className='block mb-1 font-medium'>
          メールアドレス(必須)
        </label>
        <input
          type="email"
          placeholder="boysmatching@icloud.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <label htmlFor='email' className='block mb-1 font-medium'>
          プロフィール(必須)
        </label>
        <textarea
          placeholder="170cm 70kg 20歳 (P:16cm)"
          value={profile}
          onChange={(e) => setProfile(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <label htmlFor='title' className='block mb-1 font-medium'>
          題名(必須)
        </label>
        <input
          type="text"
          placeholder="素敵な出会いを求めています。"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-full p-2 border rounded"
        />
        <label htmlFor='Post' className='block mb-1 font-medium'>
          内容(必須)
        </label>
        <textarea
          placeholder="〇〇区に住んでいる××です。素敵な出会いを求めて始めました、メールをお待ちしています。"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          className="w-full p-2 border rounded h-24"
        />
        <label htmlFor='email' className='block mb-1 font-medium'>
          削除キー(必須)　※投稿の削除に必用なキー設定
        </label>
        <input
          type="password"
          placeholder="99999"
          value={deleteKey}
          onChange={(e) => setDeleteKey(e.target.value)}
          required
          className="w-full p-2 border rounded"
        />
        <div className="flex space-x-2">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 bg-gray-300 rounded"
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
    </main>
  );
}
