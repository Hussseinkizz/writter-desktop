use std::fs;
use std::path::PathBuf;
use tauri::{AppHandle, Emitter};

// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
fn open_file(path: String) -> Result<String, String> {
    fs::read_to_string(PathBuf::from(path)).map_err(|e| e.to_string())
}

#[tauri::command]
fn save_file(content: String, path: String) -> Result<(), String> {
    fs::write(PathBuf::from(path), content).map_err(|e| e.to_string())
}

#[tauri::command]
fn delete_file(path: String) -> Result<(), String> {
    std::fs::remove_file(std::path::PathBuf::from(path)).map_err(|e| e.to_string())
}

#[tauri::command]
fn rename_file(old_path: String, new_path: String) -> Result<(), String> {
    std::fs::rename(
        std::path::PathBuf::from(old_path),
        std::path::PathBuf::from(new_path),
    )
    .map_err(|e| e.to_string())
}

#[tauri::command]
fn create_file(path: String, content: Option<String>) -> Result<(), String> {
    use std::fs;
    use std::path::PathBuf;
    let file_path = PathBuf::from(&path);
    if let Some(parent) = file_path.parent() {
        fs::create_dir_all(parent).map_err(|e| e.to_string())?;
    }
    fs::write(&file_path, content.unwrap_or_default()).map_err(|e| e.to_string())
}

#[tauri::command]
fn create_folder(path: String) -> Result<(), String> {
    std::fs::create_dir_all(std::path::PathBuf::from(path)).map_err(|e| e.to_string())
}

#[tauri::command]
fn read_directory(path: String) -> Result<Vec<DirectoryEntry>, String> {
    use std::fs;
    use std::path::PathBuf;
    
    let dir_path = PathBuf::from(path);
    let entries = fs::read_dir(dir_path).map_err(|e| e.to_string())?;
    
    let mut result = Vec::new();
    for entry in entries {
        let entry = entry.map_err(|e| e.to_string())?;
        let path = entry.path();
        let metadata = entry.metadata().map_err(|e| e.to_string())?;
        
        result.push(DirectoryEntry {
            name: entry.file_name().to_string_lossy().to_string(),
            path: path.to_string_lossy().to_string(),
            is_dir: metadata.is_dir(),
            size: if metadata.is_file() { Some(metadata.len()) } else { None },
        });
    }
    
    // Sort: directories first, then files, both alphabetically
    result.sort_by(|a, b| {
        match (a.is_dir, b.is_dir) {
            (true, false) => std::cmp::Ordering::Less,
            (false, true) => std::cmp::Ordering::Greater,
            _ => a.name.to_lowercase().cmp(&b.name.to_lowercase()),
        }
    });
    
    Ok(result)
}

#[derive(serde::Serialize)]
struct DirectoryEntry {
    name: String,
    path: String,
    is_dir: bool,
    size: Option<u64>,
}

#[tauri::command]
fn get_command_line_args() -> Vec<String> {
    std::env::args().collect()
}

/// Handle file opening when app is opened with a file argument
fn handle_file_open_request(app: &AppHandle, file_path: &str) {
    // Emit an event to the frontend with the file path to open
    app.emit("open-file-request", file_path).unwrap_or_else(|e| {
        eprintln!("Failed to emit open-file-request event: {}", e);
    });
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_persisted_scope::init())
        .plugin(tauri_plugin_store::Builder::new().build())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            greet,
            open_file,
            save_file,
            delete_file,
            rename_file,
            create_file,
            create_folder,
            read_directory,
            get_command_line_args
        ])
        .setup(|app| {
            // Check for command line arguments on startup
            let args: Vec<String> = std::env::args().collect();
            
            // Look for markdown files in command line arguments
            for arg in args.iter().skip(1) { // Skip the first argument (executable path)
                let path = PathBuf::from(arg);
                if path.exists() && path.is_file() {
                    if let Some(extension) = path.extension() {
                        if extension == "md" || extension == "markdown" || extension == "txt" {
                            handle_file_open_request(&app.handle(), arg);
                            break; // Only handle the first file
                        }
                    }
                }
            }
            
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
