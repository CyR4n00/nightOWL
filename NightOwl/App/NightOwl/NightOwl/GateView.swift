import SwiftUI

struct GateView: View {
    @Binding var isNightTime: Bool
    @State private var timeRemaining: String = "23:59:59"

    // タイマー（モック）
    let timer = Timer.publish(every: 1, on: .main, in: .common).autoconnect()

    var body: some View {
        VStack(spacing: 40) {
            Spacer()

            Image(systemName: "moon.zzz.fill")
                .resizable()
                .scaledToFit()
                .frame(width: 80, height: 80)
                .foregroundColor(.indigo)
                .shadow(color: .indigo, radius: 10, x: 0, y: 0)

            VStack(spacing: 10) {
                Text("NightOwl")
                    .font(.largeTitle)
                    .fontWeight(.bold)
                    .foregroundColor(.white)

                Text("夜が来るまで、あと少し。")
                    .font(.subheadline)
                    .foregroundColor(.gray)
            }

            Text(timeRemaining)
                .font(.system(size: 48, weight: .thin, design: .monospaced))
                .foregroundColor(.white)
                .onReceive(timer) { _ in
                    updateCountdown()
                }

            Spacer()

            // テスト用：強制的に夜にするボタン
            Button(action: {
                withAnimation(.easeInOut(duration: 1.0)) {
                    isNightTime = true
                }
            }) {
                Text("【Debug】夜にする")
                    .font(.caption)
                    .padding()
                    .foregroundColor(.white.opacity(0.5))
                    .background(Color.white.opacity(0.1))
                    .cornerRadius(8)
            }
            .padding(.bottom, 20)
        }
        .background(Color.black.edgesIgnoringSafeArea(.all))
    }

    func updateCountdown() {
        // 簡単なカウントダウンモック
        let formatter = DateFormatter()
        formatter.dateFormat = "HH:mm:ss"
        // 実際には次の0:00までの差分を計算します
        timeRemaining = formatter.string(from: Date())
    }
}
