//
//  ContentView.swift
//  NiiVue
//
//  Created by Taylor Hanayik on 11/04/2024.
//

import SwiftUI
import WebKit
import Foundation
import UniformTypeIdentifiers

struct DocumentPicker: UIViewControllerRepresentable {
    @Binding var presented: Bool // To control the presentation state
    var onPick: (URL) -> Void // Closure to handle the picked document

    func makeUIViewController(context: Context) -> UIDocumentPickerViewController {
        let picker = UIDocumentPickerViewController(forOpeningContentTypes: [UTType.data], asCopy: true)
        picker.allowsMultipleSelection = false
        picker.delegate = context.coordinator
        return picker
    }

    func updateUIViewController(_ uiViewController: UIDocumentPickerViewController, context: Context) {
        // No need to implement anything here for the picker
    }

    func makeCoordinator() -> Coordinator {
        Coordinator(self)
    }

    class Coordinator: NSObject, UIDocumentPickerDelegate {
        var parent: DocumentPicker

        init(_ documentPicker: DocumentPicker) {
            self.parent = documentPicker
        }

        func documentPicker(_ controller: UIDocumentPickerViewController, didPickDocumentsAt urls: [URL]) {
//            guard let url = urls.first, self.isValidFileType(url: url) else { return }
            guard let url = urls.first else { return }
            parent.onPick(url) // Call the closure with the picked document URL
            parent.presented = false // Dismiss the picker
        }

        func documentPickerWasCancelled(_ controller: UIDocumentPickerViewController) {
            parent.presented = false // Dismiss the picker when cancelled
        }
        
        // Helper function to check if the URL has a valid file extension
        private func isValidFileType(url: URL) -> Bool {
            let validExtensions = ["nii", "nii.gz"]
            return validExtensions.contains(where: url.lastPathComponent.lowercased().hasSuffix)
        }
    }
}

class WebViewManager: ObservableObject {
    let webView: WKWebView
    var url: URL = Bundle.main.url(forResource: "index", withExtension: "html", subdirectory: "dist")! // promise that it will be there
    
    init() {
        let config = WKWebViewConfiguration()
        config.preferences.setValue(true, forKey: "allowFileAccessFromFileURLs")
        config.setValue(true, forKey: "allowUniversalAccessFromFileURLs")
        self.webView = WKWebView(frame: .zero, configuration: config)
        self.webView.allowsBackForwardNavigationGestures = false
        self.webView.underPageBackgroundColor = UIColor.black
        self.webView.isOpaque = false
        self.webView.backgroundColor = UIColor.clear
        self.webView.isInspectable = true
        
    }
    
    // load the default page from the react app
    func load() {
        webView.loadFileURL(url, allowingReadAccessTo: url)
    }
    
    func showAlert() {
        webView.evaluateJavaScript("window.testFunction()") {(result, error) in
            if error == nil {
                print(result)
            }
        }
    }
    
    func loadNewImage(base64: String) {
        webView.evaluateJavaScript("window.loadBase64Image('\(base64)')") {(result, error) in
            if error == nil {
                print(result)
            }
        }
    }
    
    func saveDrawing() {
        webView.evaluateJavaScript("window.saveDrawing()") {(result, error) in
            if error == nil {
                print(result)
            }
        }
    }
}
    
struct WebView: UIViewRepresentable {
    @ObservedObject var manager: WebViewManager
    
    func makeUIView(context: Context) -> WKWebView {
        return manager.webView
    }
    
    func updateUIView(_ uiView: WKWebView, context: Context) {
        // This function can be used to update the view when SwiftUI state changes.
        // However, with the WebViewManager handling WebView actions, this may not be needed.
    }
}


struct ContentView: View {
    @StateObject private var webViewManager = WebViewManager()
    @State private var documentPickerPresented = false
    @State private var pickedDocumentURL: URL?
    @State private var base64EncodedString: String?
    
    func encodeFileToBase64(url: URL) -> String? {
        do {
            let fileData = try Data(contentsOf: url)
            let base64String = fileData.base64EncodedString()
            return base64String
        } catch {
            print("Error reading file: \(error)")
            return nil
        }
    }
    
    var body: some View {
        VStack {
            HStack {
                // show the name of the opened file if it is a truthy value
                if let url = pickedDocumentURL {
                    Text("\(url.lastPathComponent)")
                        .foregroundColor(.white)
                        .padding()
                }
                Button(action: {
                    webViewManager.saveDrawing()
                })
                {
                    Image(systemName: "plus")
                        .padding()
                        .foregroundColor(.white) // Ensure the "+" icon is visible on a black background
                }
                Spacer() // Pushes the button to the right, and text to the left
                Button(action: {
//                    webViewManager.showAlert()
                    documentPickerPresented = true
                })
                {
                    Image(systemName: "plus")
                        .padding()
                        .foregroundColor(.white) // Ensure the "+" icon is visible on a black background
                }
                .sheet(isPresented: $documentPickerPresented) {
                    DocumentPicker(presented: $documentPickerPresented) { url in
                        pickedDocumentURL = url
                        // Handle the picked document URL
                        if let encodedString = encodeFileToBase64(url: url) {
                            base64EncodedString = encodedString
                            // let's send the encoded string to the webview
//                            webViewManager.loadNewImage(base64: encodedString)
//                            if let base64 = base64EncodedString {
//                                webViewManager.loadNewImage(base64: base64)
//                            }
                        }
                    }
                }
            } // HStack
            .padding(.horizontal) // Adds some padding on the left and right
            .background(Color.black)
            
            // show the webview
            WebView(manager: webViewManager)
                .onAppear {
                    webViewManager.load()
                } // onAppear
                .background(Color.black)
                .padding()
//            if let base64 = base64EncodedString {
//                Text("Base64 Encoded String: \(base64.prefix(100))...") // Show a preview of the string
//                    .foregroundColor(.white)
//                    .padding()
//            }
        } // VStack
        .onChange(of: base64EncodedString) { newValue in
            // Call a function or handle the change here
            print("Base64 string updated")
            if let safeBase64 = newValue {
                webViewManager.loadNewImage(base64: safeBase64)
            }
        }
        .background(Color.black)
    }
}
