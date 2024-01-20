//
//  ContentView.swift
//  NiiVue
//
//  Created by Taylor Hanayik on 03/01/2024.
//

//import SwiftUI
//import WebKit
//
//struct WebView: UIViewRepresentable {
//    let url: URL
//
//    func makeUIView(context: Context) -> WKWebView {
//        return WKWebView()
//    }
//
//    func updateUIView(_ uiView: WKWebView, context: Context) {
//        let request = URLRequest(url: url)
//        uiView.load(request)
//    }
//}
//
//struct ContentView: View {
//    var body: some View {
//        WebView(url: URL(string: "https://niivue.github.io/niivue/features/draw.ui.html")!)
//    }
//}

import SwiftUI
import WebKit

struct WebView: UIViewRepresentable {
//    func makeUIView(context: Context) -> WKWebView {
//
//        return WKWebView()
//    }
    let url: URL
    func makeUIView(context: Context) -> WKWebView {
            // configuring the `WKWebView` is very important
            // without doing this the local index.html will not be able to read
            // the css or js files properly
            let config = WKWebViewConfiguration()
            config.preferences.setValue(true, forKey: "allowFileAccessFromFileURLs")
            config.setValue(true, forKey: "allowUniversalAccessFromFileURLs")
            // set the configuration on the `WKWebView`
            // don't worry about the frame: .zero, SwiftUI will resize the `WKWebView` to
            // fit the parent
            let webView = WKWebView(frame: .zero, configuration: config)
            // now load the local url
            webView.loadFileURL(url, allowingReadAccessTo: url)
            return webView
        }


    func updateUIView(_ uiView: WKWebView, context: Context) {
        if let filePath = Bundle.main.path(forResource: "index", ofType: "html", inDirectory: "dist") {
                    let fileURL = URL(fileURLWithPath: filePath, isDirectory: false)
                    let request = URLRequest(url: fileURL)
                    uiView.load(request)
                    print("Loaded index.html from: \(fileURL)")
                } else {
                    print("Failed to find index.html in the bundle.")
                }
    }
}

//struct ContentView: View {
//    var body: some View {
//        WebView()
//    }
//}
struct ContentView: View {
    var body: some View {
        WebView(url:
          Bundle.main.url(
            forResource: "index",
            withExtension: "html",
            subdirectory: "dist")!
            )
            .ignoresSafeArea()
    }
}

