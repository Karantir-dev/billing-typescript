const EXIST_OS_ICON = [
  'almalinux',
  'astralinux',
  'bitrix',
  'centos',
  'chrome',
  'debian',
  'django',
  'fedora',
  'freebsd',
  'hestiacp',
  'ispmanager',
  'lamp',
  'lemp',
  'linux',
  'nagios',
  'null',
  'openvpn',
  'oracle',
  'proxmox',
  'redmine',
  'rocky',
  'teamspeak',
  'tomcat',
  'ubuntu',
  'vestacp',
  'vmmanager',
  'windows',
  'wireguard',
  'zabbix',
  'altlinux',
  'arch',
  'cirros',
  'dos',
  'gnome',
  'mageia',
  'macos',
  'mandrake',
  'netbsd',
  'opensuse',
  'rhel',
  'rhl',
  'solaris',
  'suse',
  'iso',
]

export default function getImageIconName(distro, isDarkTheme) {
  const icon = distro?.match(/^(.+?)(?=-|\s|$)/g)?.[0]?.toLowerCase()

  return EXIST_OS_ICON.includes(icon)
    ? isDarkTheme
      ? `${icon}_dt`
      : icon
    : isDarkTheme
      ? 'linux-logo_dt'
      : 'linux-logo'
}
