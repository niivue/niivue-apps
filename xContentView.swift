//
//  xContentView.swift
//  NiiVue
//
//  Created by Taylor Hanayik on 03/01/2024.
//

import SwiftUI
import WebKit
import UniformTypeIdentifiers // For specifying file types

struct xWebView: UIViewRepresentable {
    let url: URL
    
    func makeUIView(context: Context) -> WKWebView {
        let config = WKWebViewConfiguration()
        config.preferences.setValue(true, forKey: "allowFileAccessFromFileURLs")
        config.setValue(true, forKey: "allowUniversalAccessFromFileURLs")
        let webView = WKWebView(frame: .zero, configuration: config)
        webView.loadFileURL(url, allowingReadAccessTo: url)
        return webView
    }

    func updateUIView(_ uiView: WKWebView, context: Context) {
        // WebView update logic...
    }
    
    func sendData() {
        
    }
}

// DocumentPicker for selecting .nii.gz files
struct DocumentPicker: UIViewControllerRepresentable {
    var onPick: (URL) -> Void
    
    func makeCoordinator() -> Coordinator {
        return Coordinator(self)
    }
    
    class Coordinator: NSObject, UIDocumentPickerDelegate, UINavigationControllerDelegate {
        var parent: DocumentPicker
        
        init(_ documentPicker: DocumentPicker) {
            self.parent = documentPicker
        }
        
        func documentPicker(_ controller: UIDocumentPickerViewController, didPickDocumentsAt urls: [URL]) {
            guard let url = urls.first else { return }
            parent.onPick(url)
        }
    }
    
    func makeUIViewController(context: Context) -> UIDocumentPickerViewController {
        let picker = UIDocumentPickerViewController(forOpeningContentTypes: [UTType("org.gnu.gnu-zip-archive")!], asCopy: true)
        picker.delegate = context.coordinator
        return picker
    }
    
    func updateUIViewController(_ uiViewController: UIDocumentPickerViewController, context: Context) {
        // No need to update the UIViewController
    }
}

// ContentView with added "+" button
struct xContentView: View {
    @State private var url: URL? = Bundle.main.url(forResource: "index", withExtension: "html", subdirectory: "dist")
    @State private var showDocumentPicker = false
    var webView: WKWebView!
    
    var body: some View {
        VStack {
            HStack {
                Spacer() // Pushes the button to the right
                Button(action: {
                    self.showDocumentPicker = true
                }) {
                    Image(systemName: "plus")
                        .padding()
                        .foregroundColor(.white) // Ensure the "+" icon is visible on a black background
                }
            }
            .padding(.horizontal) // Adds some padding on the left and right
            
            if let url = url {
                WebView(url: url)
            }
        }
        .background(Color.black) // Sets the VStack background to black
//        .edgesIgnoringSafeArea(.all) // Optional: Ignore the safe area to extend the black background to the edges of the screen
        .sheet(isPresented: $showDocumentPicker) {
            DocumentPicker { pickedURL in
//                self.url = pickedURL // Update the WebView URL if needed
                // Ensure webView is not nil before using it
                    guard let webView = self.webView else {
                        print("WebView is nil")
                        return
                    }
                print(pickedURL)
                let javascript = "testFunction()"
                webView.evaluateJavaScript(javascript) { (result, error) in
                    if let error = error {
                        print("Error evaluating JavaScript code:", error.localizedDescription)
                    } else {

                    }
                }
                
            }
        }
    }
}


