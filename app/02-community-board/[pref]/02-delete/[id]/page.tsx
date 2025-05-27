// app/02-community-board/[pref]/02-delete/[id]/page.tsx
'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
// ↓ 相対パスは「5階層上」にある lib/supabaseClient.ts を指す
import { supabase } from '../../../../../lib/supabaseClient';

export default function DeletePostPage() {
  const { pref, id } = useParams() as { pref: string; id: string };
  const decodedPref = decodeURIComponent(pref);
  const postId = Number(id);
  const router = useRouter();
  const [key, setKey] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleDelete = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!key.trim()) {
      setErrorMsg('削除キーを入力してください');
      return;
    }
    const { error } = await supabase
      .from('TBL_T_POSTS')
      .delete()
      .match({ id: postId, delete_key: key });
    if (error) {
      setErrorMsg('削除に失敗しました：キーが違う可能性があります');
    } else {
      router.push(`/02-community-board/${pref}`);
    }
  };

  return (
    <main className="p-6 max-w-md mx-auto bg-white shadow-lg rounded-xl">
      <h1 className="text-2xl font-semibold mb-4">
        「{decodedPref}」の投稿削除
      </h1>
      <form onSubmit={handleDelete} className="space-y-4">
        <p>投稿ID: {postId}</p>
        <input
          type="password"
          placeholder="削除キーを入力"
          value={key}
          onChange={(e) => {
            setKey(e.target.value);
            setErrorMsg('');
          }}
          className="w-full p-2 border rounded"
        />
        {errorMsg && <p className="text-red-600 text-sm">{errorMsg}</p>}
        <div className="flex justify-between">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 bg-gray-300 rounded"
          >
            キャンセル
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-red-500 text-white rounded"
          >
            削除する
          </button>
        </div>
      </form>
    </main>
  );
}
