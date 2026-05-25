import SwiftUI

struct MyPageView: View {
    @State private var isPremium: Bool = false // サブスク状態のモック
    @State private var showSecretPast: Bool = false
    @State private var passcodeInput: String = ""

    var body: some View {
        NavigationView {
            ZStack {
                nightNavy.edgesIgnoringSafeArea(.all)

                VStack(spacing: 24) {
                    // プロフィール部分
                    VStack(spacing: 12) {
                        Image(systemName: "person.circle.fill")
                            .resizable()
                            .frame(width: 80, height: 80)
                            .foregroundColor(.gray)

                        Text("My Username")
                            .font(.title2)
                            .fontWeight(.bold)
                            .foregroundColor(.white)

                        if isPremium {
                            Text("Premium Member")
                                .font(.caption)
                                .padding(.horizontal, 12)
                                .padding(.vertical, 4)
                                .background(Color.indigo)
                                .cornerRadius(10)
                                .foregroundColor(.white)
                        } else {
                            Button("プレミアムにアップグレード") {
                                // 課金画面への遷移モック
                                isPremium = true
                            }
                            .font(.caption)
                            .padding(.horizontal, 16)
                            .padding(.vertical, 8)
                            .glassStyle(cornerRadius: 15)
                            .overlay(
                                RoundedRectangle(cornerRadius: 15)
                                    .stroke(LinearGradient(gradient: Gradient(colors: [.orange, .purple]), startPoint: .topLeading, endPoint: .bottomTrailing), lineWidth: 1)
                            )
                            .foregroundColor(.white)
                        }
                    }
                    .padding(.top, 40)

                    Divider().background(Color.gray)

                    // プレミアム限定機能
                    VStack(alignment: .leading, spacing: 16) {
                        Text("プレミアム限定機能")
                            .font(.headline)
                            .foregroundColor(.indigo)

                        HStack {
                            Image(systemName: "lock.fill")
                                .foregroundColor(isPremium ? .white : .gray)
                            Text("夜の記録を振り返る")
                                .foregroundColor(isPremium ? .white : .gray)
                            Spacer()
                        }
                        .padding()
                        .glassStyle(cornerRadius: 16)
                        .onTapGesture {
                            if isPremium {
                                showSecretPast = true
                            }
                        }
                    }
                    .padding(.horizontal)

                    Spacer()
                }
            }
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .principal) {
                    Text("マイページ")
                        .font(.headline)
                        .foregroundColor(.indigo)
                }
            }
            .sheet(isPresented: $showSecretPast) {
                SecretPastView()
            }
        }
    }
}

struct SecretPastView: View {
    @Environment(\.presentationMode) var presentationMode

    var body: some View {
        NavigationView {
            ZStack {
                nightNavy.edgesIgnoringSafeArea(.all)

                VStack {
                    Text("ここはあなただけの秘密の場所です。\n過去の夜に書き込んだ記録が残っています。")
                        .foregroundColor(.gray)
                        .multilineTextAlignment(.center)
                        .padding()

                    List {
                        Text("3日前の夜: 明日も仕事か...休みたい。")
                            .padding(.vertical, 8)
                            .listRowBackground(Color.clear)
                            .listRowSeparator(.hidden)
                            .glassStyle(cornerRadius: 12)
                            .foregroundColor(.white)
                            .padding(.vertical, 4)

                        Text("1週間前の夜: 映画観てたらこんな時間。最高。")
                            .padding(.vertical, 8)
                            .listRowBackground(Color.clear)
                            .listRowSeparator(.hidden)
                            .glassStyle(cornerRadius: 12)
                            .foregroundColor(.white)
                            .padding(.vertical, 4)
                    }
                    .listStyle(PlainListStyle())
                    .background(Color.clear)
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
                    Text("過去の夜の記録")
                        .font(.headline)
                        .foregroundColor(.white)
                }
            }
        }
    }
}

struct MyPageView_Previews: PreviewProvider {
    static var previews: some View {
        MyPageView()
            .preferredColorScheme(.dark)
    }
}
