with open('NightOwl/web-prototype/src/views/HomeView.tsx', 'r') as f:
    content = f.read()

import re
resolved = re.sub(
    r'<<<<<<< HEAD\n\s*<button\n\s*onClick=\{handlePost\}\n\s*disabled=\{!inputText\.trim\(\)\}\n\s*aria-label="投稿する"\n\s*className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-300 hover:bg-indigo-500/40 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"\n\s*>\n=======\n\s*<button aria-label="投稿を送信" onClick=\{handlePost\} className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-300 hover:bg-indigo-500/40 transition-colors">\n>>>>>>> origin/feature/nightowl-prototype-18233615693728309359',
    '''          <button
            onClick={handlePost}
            disabled={!inputText.trim()}
            aria-label="投稿を送信"
            className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-300 hover:bg-indigo-500/40 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >''',
    content
)

with open('NightOwl/web-prototype/src/views/HomeView.tsx', 'w') as f:
    f.write(resolved)
