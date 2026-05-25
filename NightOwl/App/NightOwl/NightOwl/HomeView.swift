import SwiftUI

struct Post: Identifiable {
    let id = UUID()
    let username: String
    let content: String
    let time: String
}

struct HomeView: View {
    @State private var newPostText: String = ""

    // ダミーデータ
    @State private var posts: [Post] = [
        Post(username: "yuki", content: "眠れない。コーヒー飲みすぎた。", time: "01:23"),
        Post(username: "anonymous_owl", content: "明日のプレゼン嫌だなぁ...", time: "01:45"),
        Post(username: "kenta", content: "夜の散歩中。風が気持ちいい。", time: "02:10")
    ]

    var body: some View {
        NavigationView {
            ZStack {
                nightNavy.edgesIgnoringSafeArea(.all)

                VStack {
                    // タイムライン
                    ScrollView {
                        LazyVStack(spacing: 20) {
                            ForEach(posts) { post in
                                PostRow(post: post)
                            }
                        }
                        .padding()
                    }

                    // 投稿エリア
                    HStack {
                        TextField("夜の独り言...", text: $newPostText)
                            .padding()
                            .glassStyle(cornerRadius: 20)
                            .foregroundColor(.white)

                        Button(action: {
                            if !newPostText.isEmpty {
                                let newPost = Post(username: "me", content: newPostText, time: "Now")
                                posts.insert(newPost, at: 0)
                                newPostText = ""
                            }
                        }) {
                            Image(systemName: "paperplane.fill")
                                .foregroundColor(.indigo)
                                .padding()
                                .glassStyle(cornerRadius: 25)
                        }
                    }
                    .padding()
                }
            }
            .background(nightNavy.edgesIgnoringSafeArea(.all))
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .principal) {
                    Text("NightOwl")
                        .font(.headline)
                        .foregroundColor(.indigo)
                        .shadow(color: .indigo, radius: 5, x: 0, y: 0)
                }
            }
        }
    }
}

struct PostRow: View {
    let post: Post

    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            HStack {
                Circle()
                    .fill(Color.gray.opacity(0.5))
                    .frame(width: 30, height: 30)
                Text(post.username)
                    .font(.subheadline)
                    .fontWeight(.bold)
                    .foregroundColor(.white.opacity(0.8))
                Spacer()
                Text(post.time)
                    .font(.caption)
                    .foregroundColor(.gray)
            }

            Text(post.content)
                .font(.body)
                .foregroundColor(.white)
                .padding(.leading, 38) // アイコンの幅分インデント
        }
        .padding()
        .glassStyle(cornerRadius: 16)
    }
}

struct HomeView_Previews: PreviewProvider {
    static var previews: some View {
        HomeView()
            .preferredColorScheme(.dark)
    }
}
