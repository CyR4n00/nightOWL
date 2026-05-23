# NightOwl データベース設計（Supabase）

## 1. users
ユーザーの基本情報を管理。
- `id` (uuid, primary key): Supabase AuthのユーザーID
- `username` (text): 表示名
- `avatar_url` (text, nullable): アイコン画像のURL
- `is_premium` (boolean): サブスクリプション課金フラグ（デフォルト: false）
- `created_at` (timestamp with time zone): 作成日時

## 2. posts
タイムラインに流れる深夜の投稿。
- `id` (uuid, primary key): 投稿ID
- `user_id` (uuid, foreign key: users.id): 投稿者
- `content` (text): 投稿内容
- `is_deleted` (boolean): 論理削除フラグ（朝4時にtrueになる）
- `created_at` (timestamp with time zone): 作成日時

## 3. friends
ユーザー間のフレンド関係。
- `user_id_1` (uuid, foreign key: users.id)
- `user_id_2` (uuid, foreign key: users.id)
- `status` (text): 状態（'pending', 'accepted' など）
- `created_at` (timestamp with time zone): 作成日時
- *Primary Key は (user_id_1, user_id_2) の複合キー*

## 4. chats
フレンド間でのチャットメッセージ。
- `id` (uuid, primary key)
- `sender_id` (uuid, foreign key: users.id)
- `receiver_id` (uuid, foreign key: users.id)
- `message` (text): メッセージ内容
- `is_deleted` (boolean): 論理削除フラグ（朝4時にtrueになる）
- `created_at` (timestamp with time zone): 作成日時

## バッチ処理（朝4時の削除）
Supabaseの `pg_cron` を使用し、毎日朝4時（JST）に以下のSQLを実行する想定。
```sql
UPDATE posts SET is_deleted = true WHERE is_deleted = false;
UPDATE chats SET is_deleted = true WHERE is_deleted = false;
```
※ プレミアムユーザー向けの「振り返り機能」は、`is_deleted = true` でも `user_id` が一致すれば取得できるようにRLS（Row Level Security）で制御する。
