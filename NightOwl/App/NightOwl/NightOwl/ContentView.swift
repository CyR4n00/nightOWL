import SwiftUI

struct ContentView: View {
    @State private var isNightTime: Bool = false

    var body: some View {
        ZStack {
            Color.black.edgesIgnoringSafeArea(.all)

            if isNightTime {
                MainTabView()
            } else {
                GateView(isNightTime: $isNightTime)
            }
        }
        .onAppear {
            checkTime()
        }
    }

    // 現在の時間をチェックし、24:00〜4:00の間ならtrueにするロジック（モック用）
    func checkTime() {
        let calendar = Calendar.current
        let hour = calendar.component(.hour, from: Date())

        // テストのために一時的に常にtrueやfalseに切り替え可能
        // 本来は: if hour >= 0 && hour < 4

        // TODO: テスト時はここで強制的に true または false を指定できます
        isNightTime = false // 初期値はGateViewを見せる
    }
}

// ログイン後のタブバー（夜間用）
struct MainTabView: View {
    var body: some View {
        TabView {
            HomeView()
                .tabItem {
                    Image(systemName: "house.fill")
                    Text("ホーム")
                }

            FriendChatView()
                .tabItem {
                    Image(systemName: "message.fill")
                    Text("チャット")
                }

            MyPageView()
                .tabItem {
                    Image(systemName: "person.fill")
                    Text("マイページ")
                }
        }
        .accentColor(.indigo) // 選択されたタブの色
    }
}

struct ContentView_Previews: PreviewProvider {
    static var previews: some View {
        ContentView()
    }
}
