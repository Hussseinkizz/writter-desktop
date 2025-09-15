'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { 
  FiDownload, 
  FiMonitor,
} from 'react-icons/fi';
import { 
  SiApple, 
  SiLinux,
  SiUbuntu,
  SiRedhat
} from 'react-icons/si';
import { getLatestReleaseAssets, formatFileSize, detectOS, type DownloadAsset } from '@/lib/download-utils';
import { useEffect, useState } from 'react';

// Custom Windows icon component since SiWindows doesn't exist
function WindowsIcon({ className }: { className?: string }) {
  return (
    // biome-ignore lint/a11y/noSvgWithoutTitle: doesn't apply
<svg 
      viewBox="0 0 24 24" 
      className={className}
      fill="currentColor"
    >
      <path d="M3 5.557l7.357-1.002.004 7.097-7.354.042L3 5.557zm7.354 6.913l.006 7.103-7.354-1.011v-6.14l7.348.048zm.892-8.046L21.001 3v8.562l-9.755.077V4.424zm9.758 8.113l-.003 8.523-9.755-1.378-.014-7.161 9.772.016z"/>
    </svg>
  );
}

interface OSDownloadGroup {
  os: string;
  icon: React.ComponentType<{ className?: string }>;
  primary: DownloadAsset;
  alternatives: DownloadAsset[];
}

function groupDownloadsByOS(): OSDownloadGroup[] {
  const assets = getLatestReleaseAssets();
  
  const windows = assets.filter(a => a.os === 'windows');
  const macos = assets.filter(a => a.os === 'macos');
  const linux = assets.filter(a => a.os === 'linux');

  return [
    {
      os: 'Windows',
      icon: WindowsIcon,
      primary: windows.find(a => a.type === 'exe')!,
      alternatives: windows.filter(a => a.type !== 'exe')
    },
    {
      os: 'macOS',
      icon: SiApple,
      primary: macos[0],
      alternatives: macos.slice(1)
    },
    {
      os: 'Linux',
      icon: SiLinux,
      primary: linux.find(a => a.type === 'deb')!,
      alternatives: linux.filter(a => a.type !== 'deb')
    }
  ];
}

function getOSIcon(type: string): React.ComponentType<{ className?: string }> {
  const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
    exe: WindowsIcon,
    msi: WindowsIcon,
    dmg: SiApple,
    deb: SiUbuntu,
    rpm: SiRedhat,
    appimage: SiLinux
  };
  
  return iconMap[type] || FiMonitor;
}

export function DownloadSection() {
  const [userOS, setUserOS] = useState<string>('');
  const downloadGroups = groupDownloadsByOS();

  useEffect(() => {
    setUserOS(detectOS());
  }, []);

  const handleDownload = (asset: DownloadAsset) => {
    window.open(asset.url, '_blank');
  };

  return (
    <section className="py-20 px-6 bg-zinc-950/50">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            Download Writter
          </h2>
          <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
            Choose your platform and start writing. Available for all major operating systems.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {downloadGroups.map((group, index) => {
            const Icon = group.icon;
            const isRecommended = group.os.toLowerCase() === userOS;
            
            return (
              <motion.div
                key={group.os}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className={`relative h-full ${isRecommended ? 'ring-2 ring-violet-500' : ''}`}>
                  {isRecommended && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <span className="bg-violet-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                        Recommended
                      </span>
                    </div>
                  )}
                  
                  <CardHeader className="text-center">
                    <div className="flex justify-center mb-4">
                      <Icon className="w-12 h-12 text-zinc-400" />
                    </div>
                    <CardTitle className="text-2xl">{group.os}</CardTitle>
                    <CardDescription>
                      {group.primary.name} • {formatFileSize(group.primary.size)}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <Button 
                      className="w-full bg-violet-600 hover:bg-violet-700 text-white"
                      size="lg"
                      onClick={() => handleDownload(group.primary)}
                    >
                      <FiDownload />
                      Download {group.primary.type.toUpperCase()}
                    </Button>
                    
                    {group.alternatives.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-sm text-zinc-500 text-center">
                          Alternative formats:
                        </p>
                        {group.alternatives.map((alt) => {
                          const AltIcon = getOSIcon(alt.type);
                          return (
                            <Button
                              key={alt.type}
                              variant="ghost"
                              size="sm"
                              className="w-full justify-start text-zinc-400 hover:text-white"
                              onClick={() => handleDownload(alt)}
                            >
                              <AltIcon className="w-4 h-4" />
                              {alt.name} ({formatFileSize(alt.size)})
                            </Button>
                          );
                        })}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-12"
        >
          <p className="text-zinc-500 mb-4">
            Looking for older versions or need help installing?
          </p>
          <Button 
            variant="outline" 
            onClick={() => window.open('https://github.com/Hussseinkizz/writter-desktop/releases', '_blank')}
          >
            View All Releases
          </Button>
        </motion.div>
      </div>
    </section>
  );
}