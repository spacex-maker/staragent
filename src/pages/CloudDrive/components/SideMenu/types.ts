export interface CloudProvider {
  id: number;
  providerName: string;
  isDefault: boolean;
  iconImg?: string;
}

export interface StorageStatsModalProps {
  open: boolean;
  onClose: () => void;
} 