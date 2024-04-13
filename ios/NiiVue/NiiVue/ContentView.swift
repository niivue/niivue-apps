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
    
    private func saveBase64StringToNifti(_ base64String: String, baseImageUrl: String) {
        // make sure the following properties are added to Info.plist and set to YES
        // Application supports iTunes file sharing : YES
        // Supports opening documents in place : YES
        guard let data = Data(base64Encoded: base64String) else {
            print("Error: Base64 string is malformed.")
            return
        }
        let date = Date()
        let dateFormatter = DateFormatter()
        dateFormatter.dateFormat = "YYYY-MM-dd_HH-mm-ss"
        let dateString = dateFormatter.string(from: date)
        let url = URL.documentsDirectory.appendingPathComponent("drawing_\(dateString)_\(baseImageUrl)")
        do {
            try data.write(to: url, options: [.atomic, .completeFileProtection])
            
            // check that the file exists and log the file size
            let attributes = try FileManager.default.attributesOfItem(atPath: url.path)
            if let fileSize = attributes[.size] as? NSNumber {
                print("File written with size: \(fileSize.intValue) bytes")
            }
        } catch {
            print("Failed to write or check file:", error.localizedDescription)
        }
    }
    
    // load the default page from the react app
    func load() {
        webView.loadFileURL(url, allowingReadAccessTo: url)
    }
    
    func loadBase64Image(base64: String) {
        webView.evaluateJavaScript("window.loadBase64Image('\(base64)')") {(result, error) in
            if error == nil {
                print(result ?? "")
            }
        }
    }
    
    func saveDrawing(baseImageUrl: String) -> Bool {
        var ok = false
        webView.evaluateJavaScript("window.saveDrawing()") {(result, error) in
            if error == nil {
                print(result ?? "")
                print("result was above!")
                self.saveBase64StringToNifti(result as! String, baseImageUrl: baseImageUrl)
                ok = true
            } else {
                print(error ?? "")
                ok = false
            }
        }
        return ok // TODO: this does not seem to ever be true, but file saving does work...
    }
    
    func setCrosshairColor() {
        webView.evaluateJavaScript("window.setCrosshairColor()") {(result, error) in
            if error == nil {
                print(result ?? "")
            }
        }
    }
    
    // set multiplanar layout in Niivue
    // 0 = auto
    // 1 = column
    // 2 = grid
    // 3 = row
    func setLayout(layout: Int) {
        webView.evaluateJavaScript("window.setLayout(\(layout))") {(result, error) in
            if error == nil {
                print(result ?? "")
            }
        }
    }
    
    // show 3D crosshair or not in Niivue
    func set3dCrosshairVisible(visible: Bool) {
        webView.evaluateJavaScript("window.set3dCrosshairVisible(\(visible))") {(result, error) in
            if error == nil {
                print(result ?? "")
            }
        }
    }
    
    // show 3D crosshair or not in Niivue
    func set2dCrosshairVisible(visible: Bool) {
        webView.evaluateJavaScript("window.set2dCrosshairVisible(\(visible))") {(result, error) in
            if error == nil {
                print(result ?? "")
            }
        }
    }
    
    // set sliceType in Niivue
    func setSliceType(sliceType: Int) {
        webView.evaluateJavaScript("window.setSliceType(\(sliceType))") {(result, error) in
            if error == nil {
                print(result ?? "")
            }
        }
    }
    
    // set drag mode in Niivue
    func setDragMode(dragMode: Int) {
        webView.evaluateJavaScript("window.setDragMode(\(dragMode))") {(result, error) in
            if error == nil {
                print(result ?? "")
            }
        }
    }
    
    // set pen value for drawing in Niivue
    func setPenValue(penValue: Int, isFilled: Bool, drawingEnabled: Bool) {
        webView.evaluateJavaScript("window.setPenValue(\(penValue), \(isFilled), \(drawingEnabled))") {(result, error) in
            if error == nil {
                print(result ?? "")
            }
        }
    }
    
    // set orientation text to corners or not
    func setCornerText(isCorners: Bool) {
        webView.evaluateJavaScript("window.setCornerText(\(isCorners))") {(result, error) in
            if error == nil {
                print(result ?? "")
            }
        }
    }
    
    // set orientation cube
    func setOrientationCube(isOrientationCube: Bool) {
        webView.evaluateJavaScript("window.setOrientationCube(\(isOrientationCube))") {(result, error) in
            if error == nil {
                print(result ?? "")
            }
        }
    }
    
    // set radiological or not
    func setRadiological(isRadiological: Bool) {
        webView.evaluateJavaScript("window.setRadiological(\(isRadiological))") {(result, error) in
            if error == nil {
                print(result ?? "")
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
    @State private var settingsSheetPresented = false
    @State private var pickedDocumentURL: URL?
    @State private var base64EncodedString: String?
    @State private var sliceType = SliceTypes.Multiplanar.rawValue // default sliceType is multiplanar
    @State private var layout = LayoutTypes.Auto.rawValue // the default is Auto
    @State private var dragType = DragTypes.Contrast.rawValue // the default is Contrast
    @State private var show3dCrosshair = false
    @State private var show2dCrosshair = true
    @State private var penValue = PenTypes.Red.rawValue // default is red
    @State private var drawingEnabled = false // can the user draw?
    @State private var isFilled = true // is the pen filled or not?
    @State private var cornerText = false // put orientation labels in the corder or not?
    @State private var orientationCube = false // by default the 3D orientation cube is hidden
    @State private var radiological = false // use radiological convention or not in Niivue
    @State private var saveFileAlert = false
    @State private var showingSaveAlert = false
    
    enum SliceTypes: Int, CaseIterable, Identifiable {
        case Axial = 0
        case Coronal = 1
        case Sagittal = 2
        case Multiplanar = 3
        case Render = 4
        var id: Self { self }
    }
    
    enum LayoutTypes: Int, CaseIterable, Identifiable {
        case Auto = 0
        case Column = 1
        case Grid = 2
        case Row = 3
        var id: Self { self }
    }
    
    enum DragTypes: Int, CaseIterable, Identifiable {
        case None = 0
        case Contrast = 1
        case Measure = 2
        case Pan = 3
        case Slicer3D = 4
        var id: Self { self }
    }
    
    enum PenTypes: Int, CaseIterable, Identifiable {
        case Erase = 0
        case Red = 1
        case Green = 2
        case Blue = 3
        case Yellow = 4
        case Cyan = 5
        case Purple = 6
        var id: Self { self }
    }
    
    // detect if iOS or macOS and set the drag setting text
#if os(iOS)
    let dragLabel = "Drag action (double tap)"
#elseif os(macOS)
    let dragLabel = "Drag action (right click)"
#endif
    
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
                if drawingEnabled {
                    Button(action: {
                        let date = Date()
                        let dateFormatter = DateFormatter()
                        dateFormatter.dateFormat = "YYYY-MM-dd_HH-mm-ss"
                        let dateString = dateFormatter.string(from: date) + ".nii.gz"
                        let ok = webViewManager.saveDrawing(baseImageUrl: pickedDocumentURL?.lastPathComponent ?? dateString) // default is date string + .nii.gz
                        showingSaveAlert = true
                    })
                    {
                        Image(systemName: "square.and.arrow.up")
                            .padding()
                            .foregroundColor(.white) // Ensure the "+" icon is visible on a black background
                    }
                    .alert("Drawing saved to app folder", isPresented: $showingSaveAlert) {
                        Button("OK", role: .cancel) { }
                    }
                }
                
                // show the name of the opened file if it is a truthy value
                // -------------------------------------------------------------
                if let url = pickedDocumentURL {
                    Text("\(url.lastPathComponent)")
                        .foregroundColor(.white)
                        .padding()
                }
                // -------------------------------------------------------------
                Spacer() // Pushes the button to the right, and text to the left
                // -------------------------------------------------------------
                Button(action: {
                    // webViewManager.showAlert()
                    drawingEnabled = false
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
                        }
                    }
                } // add image (plus) sheet end
                // -------------------------------------------------------------
                // adjust settings button
                Button(action: {
                    settingsSheetPresented = true
                })
                {
                    Image(systemName: "slider.horizontal.3")
                        .padding()
                        .foregroundColor(.white) // Ensure the "+" icon is visible on a black background
                }
                .sheet(isPresented: $settingsSheetPresented) {
                    ScrollView {
                        
                        VStack(alignment: .leading) {
                            //-----------------------------------------------------
                            // dismiss button in top right corner of sheet
                            HStack {
                                Spacer() // push button to the right (ios guidelines for sheets)
                                Button("Dismiss") {
                                    settingsSheetPresented.toggle()
                                }
                                .padding()
                            }
                            .padding()
                            //-----------------------------------------------------
                            // picker for the slice type
                            HStack {
                                Text("View type")
                                    .padding()
                                Spacer()
                                Picker("View mode", selection: $sliceType) {
                                    Text("Axial").tag(SliceTypes.Axial.rawValue)
                                    Text("Coronal").tag(SliceTypes.Coronal.rawValue)
                                    Text("Sagittal").tag(SliceTypes.Sagittal.rawValue)
                                    Text("Multiplanar").tag(SliceTypes.Multiplanar.rawValue)
                                    Text("Render").tag(SliceTypes.Render.rawValue)
                                }
                                .pickerStyle(.menu)
                                .padding()
                            }
                            //------------------------------------------------------
                            // picker for the layout type of multiplanar
                            HStack {
                                Text("Multiplanar layout ")
                                    .padding()
                                Spacer()
                                Picker("layout mode", selection: $layout) {
                                    Text("Auto").tag(LayoutTypes.Auto.rawValue)
                                    Text("Column").tag(LayoutTypes.Column.rawValue)
                                    Text("Grid").tag(LayoutTypes.Grid.rawValue)
                                    Text("Row").tag(LayoutTypes.Row.rawValue)
                                }
                                .pickerStyle(.menu)
                                .padding()
                            }
                            //------------------------------------------------------
                            // picker for the drag type
                            HStack {
                                Text(dragLabel)
                                    .padding()
                                Spacer()
                                Picker("Drag mode", selection: $dragType) {
                                    Text("None").tag(DragTypes.None.rawValue)
                                    Text("Contrast").tag(DragTypes.Contrast.rawValue)
                                    Text("Measure").tag(DragTypes.Measure.rawValue)
                                    Text("Pan").tag(DragTypes.Pan.rawValue)
                                    Text("Slicer3D").tag(DragTypes.Slicer3D.rawValue)
                                }
                                .pickerStyle(.menu)
                                .padding()
                            }
                            //------------------------------------------------------
                            // picker for the pen type
                            HStack {
                                Text("Pen type")
                                    .padding()
                                Spacer()
                                Picker("Pen type", selection: $penValue) {
                                    Label("Eraser", systemImage: "eraser").tag(PenTypes.Erase.rawValue)
                                    Label("Red", systemImage: "pencil").tag(PenTypes.Red.rawValue)
                                    Label("Green", systemImage: "pencil").tag(PenTypes.Green.rawValue)
                                    Label("Blue", systemImage: "pencil").tag(PenTypes.Blue.rawValue)
                                    Label("Cyan", systemImage: "pencil").tag(PenTypes.Cyan.rawValue)
                                    Label("Yellow", systemImage: "pencil").tag(PenTypes.Yellow.rawValue)
                                    Label("Purple", systemImage: "pencil").tag(PenTypes.Purple.rawValue)
                                }
                                .pickerStyle(.menu)
                                .padding()
                            }
                            //-------------------------------------------------------
                            // drawing enabled switch
                            HStack {
                                Toggle("Drawing enabled", isOn: $drawingEnabled)
                                    .padding()
                            }
                            //-------------------------------------------------------
                            // show 3d crosshair switch
                            HStack {
                                Toggle("3D crosshair", isOn: $show3dCrosshair)
                                    .padding()
                            }
                            //-------------------------------------------------------
                            // 2d crosshair switch
                            HStack {
                                Toggle("2D crosshair", isOn: $show2dCrosshair)
                                    .padding()
                            }
                            //-------------------------------------------------------
                            // filled pen switch
                            HStack {
                                Toggle("Auto fill pen", isOn: $isFilled)
                                    .padding()
                            }
                            //-------------------------------------------------------
                            // Corner labels switch
                            HStack {
                                Toggle("Corner text", isOn: $cornerText)
                                    .padding()
                            }
                            //-------------------------------------------------------
                            // orientation cube switch
                            HStack {
                                Toggle("Orientation cube", isOn: $orientationCube)
                                    .padding()
                            }
                            //-------------------------------------------------------
                            // radiological switch
                            HStack {
                                Toggle("Radiological convention", isOn: $radiological)
                                    .padding()
                            }
                            
                            Spacer() // push content to top to the entire sheet layout is from top to bottom (default is centered)
                        }
                        // allow both medium (half height) and large (full height) sheets
                        // iphone: sheets can be medium or large
                        // ipad: detents are ignored. Sheets can only be large
                        // macOS: sheets are more like modal views (rectangles) centered in the app window
                        .presentationDetents([.medium, .large])
                        .presentationContentInteraction(.scrolls)
                    } // Vstack in sheet
                }
            } // HStack
            .padding(.horizontal) // Adds some padding on the left and right
            .background(Color.black)
            // -------------------------------------------------------------
            // show the webview
            WebView(manager: webViewManager)
                .onAppear {
                    webViewManager.load()
                } // onAppear
                .background(Color.black)
                .padding()
        }
        .onChange(of: base64EncodedString) { newValue in
            // Call a function or handle the change
            print("Base64 string updated")
            if let safeBase64 = newValue {
                webViewManager.loadBase64Image(base64: safeBase64)
            }
        }
        .onChange(of: sliceType) { newValue in
            print("sliceType updated to: \(newValue)")
            webViewManager.setSliceType(sliceType: newValue)
        }
        .onChange(of: layout) { newValue in
            print("layout updated to: \(newValue)")
            webViewManager.setLayout(layout: newValue)
        }
        .onChange(of: dragType) { newValue in
            print("drag type updated to: \(newValue)")
            webViewManager.setDragMode(dragMode: newValue)
        }
        .onChange(of: show3dCrosshair) { newValue in
            print("show3dCrosshair updated to: \(newValue)")
            webViewManager.set3dCrosshairVisible(visible: newValue)
        }
        .onChange(of: show2dCrosshair) { newValue in
            print("show2dCrosshair updated to: \(newValue)")
            webViewManager.set2dCrosshairVisible(visible: newValue)
        }
        .onChange(of: isFilled) { newValue in
            print("isFilled updated to: \(newValue)")
            webViewManager.setPenValue(penValue: penValue, isFilled: newValue, drawingEnabled: drawingEnabled)
        }
        .onChange(of: drawingEnabled) { newValue in
            print("drawingEnabled updated to: \(newValue)")
            webViewManager.setPenValue(penValue: penValue, isFilled: isFilled, drawingEnabled: newValue)
        }
        .onChange(of: cornerText) { newValue in
            print("cornerText updated to: \(newValue)")
            webViewManager.setCornerText(isCorners: newValue)
        }
        .onChange(of: orientationCube) { newValue in
            print("orientationCube updated to: \(newValue)")
            webViewManager.setOrientationCube(isOrientationCube: newValue)
        }
        .onChange(of: radiological) { newValue in
            print("radiological updated to: \(newValue)")
            webViewManager.setRadiological(isRadiological: newValue)
        }
        .onChange(of: penValue) { newValue in
            print("penValue updated to: \(newValue)")
            webViewManager.setPenValue(penValue: newValue, isFilled: isFilled, drawingEnabled: drawingEnabled)
        }
        .background(Color.black)
    }
}
