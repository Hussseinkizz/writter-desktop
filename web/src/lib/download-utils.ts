export type OSType = "windows" | "macos" | "linux" | "unknown";

export interface DownloadAsset {
	name: string;
	url: string;
	os: OSType;
	size: number;
	type: "exe" | "msi" | "dmg" | "deb" | "rpm" | "appimage" | "tar";
}

// Detect user's operating system
export function detectOS(): OSType {
	if (typeof window === "undefined") return "unknown";

	const getPlatform = () => {
		const userAgent = window.navigator.userAgent.toLowerCase();

		if (userAgent.includes("win")) return "windows";
		if (userAgent.includes("mac")) return "macos";
		if (userAgent.includes("linux")) return "linux";

		return "unknown";
	};

	const result = getPlatform();

	return result;
}

// Get download assets for the latest release
export function getLatestReleaseAssets(): DownloadAsset[] {
	// Using the latest release data from GitHub API
	const baseUrl =
		"https://github.com/Hussseinkizz/writter-desktop/releases/download/app-v0.0.9";

	return [
		{
			name: "Windows Installer",
			url: `${baseUrl}/writter_0.0.9_x64-setup.exe`,
			os: "windows",
			size: 3210462,
			type: "exe",
		},
		{
			name: "Windows MSI",
			url: `${baseUrl}/writter_0.0.9_x64_en-US.msi`,
			os: "windows",
			size: 4481024,
			type: "msi",
		},
		{
			name: "macOS Universal",
			url: `${baseUrl}/writter_0.0.9_universal.dmg`,
			os: "macos",
			size: 9271620,
			type: "dmg",
		},
		{
			name: "Linux Debian",
			url: `${baseUrl}/writter_0.0.9_amd64.deb`,
			os: "linux",
			size: 5532910,
			type: "deb",
		},
		{
			name: "Linux AppImage",
			url: `${baseUrl}/writter_0.0.9_amd64.AppImage`,
			os: "linux",
			size: 90047680,
			type: "appimage",
		},
		{
			name: "Linux RPM",
			url: `${baseUrl}/writter-0.0.9-1.x86_64.rpm`,
			os: "linux",
			size: 5533777,
			type: "rpm",
		},
	];
}

// Get primary download for detected OS
export function getPrimaryDownload(): DownloadAsset | null {
	const userOS = detectOS();
	const assets = getLatestReleaseAssets();

	const osMap: Record<OSType, string[]> = {
		windows: ["exe", "msi"],
		macos: ["dmg"],
		linux: ["deb", "appimage"],
		unknown: [],
	};

	const preferredTypes = osMap[userOS];
	if (!preferredTypes.length) return null;

	return (
		assets.find(
			(asset) => asset.os === userOS && asset.type === preferredTypes[0],
		) || null
	);
}

// Format file size for display
export function formatFileSize(bytes: number): string {
	const sizes = ["B", "KB", "MB", "GB"];
	if (bytes === 0) return "0 B";

	const i = Math.floor(Math.log(bytes) / Math.log(1024));
	const size = bytes / Math.pow(1024, i);

	return `${size.toFixed(1)} ${sizes[i]}`;
}
