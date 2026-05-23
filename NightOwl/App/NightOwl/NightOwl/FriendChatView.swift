import SwiftUI

struct Friend: Identifiable {
    let id = UUID()
    let username: String
    let status: String // "Online", "Offline" など
}

struct ChatMessage: Identifiable {
    let id = UUID()
    let isMe: Bool
    let text: String
}

struct FriendChatView: View {
    @State private var friends = [
        Friend(username: "yuki", status: "Online"),
        Friend(username: "kenta", status: "Online"),
        Friend(username: "anonymous_owl", status: "Offline")
    ]
    @State private var selectedFriend: Friend? = nil

    var body: some View {
        NavigationView {
            ZStack {
                Color.black.edgesIgnoringSafeArea(.all)

                VStack {
                    List {
                        ForEach(friends) { friend in
                            Button(action: {
                                selectedFriend = friend
                            }) {
                                HStack {
                                    Circle()
                                        .fill(friend.status == "Online" ? Color.green : Color.gray)
                                        .frame(width: 15, height: 15)
                                    Text(friend.username)
                                        .foregroundColor(.white)
                                    Spacer()
                                    Text(friend.status)
                                        .font(.caption)
                                        .foregroundColor(.gray)
                                }
                                .padding(.vertical, 8)
                            }
                            .listRowBackground(Color.black)
                        }
                    }
                    .listStyle(PlainListStyle())
                }
            }
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .principal) {
                    Text("フレンド")
                        .font(.headline)
                        .foregroundColor(.indigo)
                }
            }
            .sheet(item: $selectedFriend) { friend in
                ChatDetailView(friend: friend)
            }
        }
    }
}

struct ChatDetailView: View {
    let friend: Friend
    @Environment(\.presentationMode) var presentationMode
    @State private var newMessageText: String = ""
    @State private var messages = [
        ChatMessage(isMe: false, text: "起きてる？"),
        ChatMessage(isMe: true, text: "起きてるよー。眠れない。"),
        ChatMessage(isMe: false, text: "同じく。明日早いのに最悪。")
    ]

    var body: some View {
        NavigationView {
            ZStack {
                Color.black.edgesIgnoringSafeArea(.all)
                VStack {
                    ScrollView {
                        LazyVStack(spacing: 12) {
                            ForEach(messages) { message in
                                HStack {
                                    if message.isMe {
                                        Spacer()
                                        Text(message.text)
                                            .padding()
                                            .background(Color.indigo)
                                            .foregroundColor(.white)
                                            .cornerRadius(16)
                                    } else {
                                        Text(message.text)
                                            .padding()
                                            .background(Color(white: 0.2))
                                            .foregroundColor(.white)
                                            .cornerRadius(16)
                                        Spacer()
                                    }
                                }
                                .padding(.horizontal)
                            }
                        }
                        .padding(.vertical)
                    }

                    // 入力エリア
                    HStack {
                        TextField("メッセージを入力...", text: $newMessageText)
                            .padding()
                            .background(Color(white: 0.15))
                            .cornerRadius(20)
                            .foregroundColor(.white)

                        Button(action: {
                            if !newMessageText.isEmpty {
                                messages.append(ChatMessage(isMe: true, text: newMessageText))
                                newMessageText = ""
                            }
                        }) {
                            Image(systemName: "paperplane.fill")
                                .foregroundColor(.indigo)
                                .padding()
                                .background(Color(white: 0.15))
                                .clipShape(Circle())
                        }
                    }
                    .padding()
                }
            }
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .navigationBarLeading) {
                    Button("閉じる") {
                        presentationMode.wrappedValue.dismiss()
                    }
                    .foregroundColor(.indigo)
                }
                ToolbarItem(placement: .principal) {
                    Text(friend.username)
                        .font(.headline)
                        .foregroundColor(.white)
                }
            }
        }
    }
}

struct FriendChatView_Previews: PreviewProvider {
    static var previews: some View {
        FriendChatView()
            .preferredColorScheme(.dark)
    }
}
