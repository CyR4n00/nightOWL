import SwiftUI

// 夜の紺色背景
let nightNavy = Color(red: 0.05, green: 0.05, blue: 0.15) // ダークネイビー

// ガラス風のモディファイア
struct GlassmorphismStyle: ViewModifier {
    var cornerRadius: CGFloat = 16

    func body(content: Content) -> some View {
        content
            .background(
                ZStack {
                    // すりガラスのベース
                    Color.white.opacity(0.05)
                        .blur(radius: 3)

                    // SwiftUIのMaterialを使ってよりリアルなすりガラス感を出す
                    if #available(iOS 15.0, *) {
                        Rectangle()
                            .fill(.ultraThinMaterial)
                            .opacity(0.8)
                    }
                }
            )
            .cornerRadius(cornerRadius)
            // ガラスのエッジ（光の反射）を表現
            .overlay(
                RoundedRectangle(cornerRadius: cornerRadius)
                    .stroke(Color.white.opacity(0.2), lineWidth: 1)
                    .blendMode(.overlay)
            )
            // 落ち影で浮遊感を出す
            .shadow(color: Color.black.opacity(0.3), radius: 10, x: 0, y: 5)
    }
}

extension View {
    func glassStyle(cornerRadius: CGFloat = 16) -> some View {
        self.modifier(GlassmorphismStyle(cornerRadius: cornerRadius))
    }
}
