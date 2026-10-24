import { links } from "./site";

/**
 * Stable, version-less asset names uploaded by qopsc/oarlock's release workflow
 * (see deploy/RELEASE-INTEGRATION.md). /releases/latest/download/<name> always
 * resolves to the newest release, so the site never needs a rebuild per release.
 */
export interface Asset {
  label: string;
  file: string;
}

export interface Platform {
  id: "macos" | "linux" | "windows";
  name: string;
  status: "available" | "soon";
  assets: Asset[];
}

export const platforms: Platform[] = [
  {
    id: "macos",
    name: "macOS",
    status: "available",
    assets: [
      { label: "Apple silicon (.dmg)", file: "oarlock-macos-arm64.dmg" },
      { label: "Intel (.dmg)", file: "oarlock-macos-x64.dmg" },
    ],
  },
  {
    id: "linux",
    name: "Linux",
    status: "available",
    assets: [
      { label: "x64 .deb", file: "oarlock-linux-x64.deb" },
      { label: "x64 .rpm", file: "oarlock-linux-x64.rpm" },
      { label: "x64 AppImage", file: "oarlock-linux-x64.AppImage" },
      { label: "arm64 .deb", file: "oarlock-linux-arm64.deb" },
      { label: "arm64 .rpm", file: "oarlock-linux-arm64.rpm" },
      { label: "arm64 AppImage", file: "oarlock-linux-arm64.AppImage" },
    ],
  },
  { id: "windows", name: "Windows", status: "soon", assets: [] },
];

export const assetUrl = (file: string) => `${links.latestDownload}/${file}`;
export const checksumsUrl = assetUrl("SHA256SUMS");
