export type Domain = "3D Image" | "2D Image" | "EHR" | "Biosignal";
export type Task = "Segmentation" | "Classification" | "Object Detection";
export type Challenge =
  | "Class Imbalance"
  | "Small Dataset"
  | "Noisy Label";

export type DomainFilter = Domain | "All";
export type TaskFilter = Task | "All";
export type ChallengeFilter = Challenge | "All";

export interface PipelineCodeSnippets {
  model: string;
  loss: string;
  augmentation: string;
}

export interface KaggleCompetition {
  id: string;
  /** Higher = listed more recently (default sort when no filters) */
  listedOrder: number;
  title: string;
  competitionName: string;
  domain: Domain;
  task: Task;
  challenge: Challenge;
  sotaModel: string;
  lossName: string;
  lossFormula: string;
  metricName: string;
  metricValue: string;
  paperUrl: string;
  colabUrl: string;
  codeSnippets: PipelineCodeSnippets;
}

export function getFullPipelineCode(snippets: PipelineCodeSnippets): string {
  return [
    "# --- Model ---",
    snippets.model.trim(),
    "",
    "# --- Loss ---",
    snippets.loss.trim(),
    "",
    "# --- Augmentation ---",
    snippets.augmentation.trim(),
  ].join("\n");
}

export const MOCK_KAGGLE_DATA: KaggleCompetition[] = [
  {
    id: "brats-2021",
    listedOrder: 1,
    title: "BraTS 2021 Brain Tumor Segmentation",
    competitionName: "BraTS 2021",
    domain: "3D Image",
    task: "Segmentation",
    challenge: "Small Dataset",
    sotaModel: "Swin UNETR",
    lossName: "Dice Loss",
    lossFormula:
      "$\\text{Dice Loss} = 1 - \\frac{2 \\sum_{i} p_{i} g_{i}}{\\sum_{i} p_{i}^{2} + \\sum_{i} g_{i}^{2}}$",
    metricName: "Mean Dice (WT)",
    metricValue: "0.91",
    paperUrl: "https://arxiv.org/abs/2201.01266",
    colabUrl:
      "https://colab.research.google.com/github/Project-MONAI/tutorials/blob/main/3d_segmentation/swin_unetr_brats21_3d_segmentation.ipynb",
    codeSnippets: {
      model: `import torch
from monai.networks.nets import SwinUNETR

model = SwinUNETR(
    img_size=(128, 128, 128),
    in_channels=4,
    out_channels=3,
    feature_size=48,
    use_checkpoint=True,
).cuda()`,
      loss: `from monai.losses import DiceLoss

dice_loss = DiceLoss(to_onehot_y=True, softmax=True)

def training_step(batch, model):
    images = batch["image"].cuda()
    labels = batch["label"].cuda()
    logits = model(images)
    return dice_loss(logits, labels)`,
      augmentation: `from monai.transforms import (
    Compose, LoadImaged, EnsureChannelFirstd,
    ScaleIntensityRanged, RandFlipd, RandRotate90d,
)

train_transforms = Compose([
    LoadImaged(keys=["image", "label"]),
    EnsureChannelFirstd(keys=["image", "label"]),
    ScaleIntensityRanged(
        keys=["image"], a_min=-175, a_max=250,
        b_min=0.0, b_max=1.0, clip=True,
    ),
    RandFlipd(keys=["image", "label"], prob=0.5, spatial_axis=0),
    RandRotate90d(keys=["image", "label"], prob=0.5, max_k=3),
])`,
    },
  },
  {
    id: "med-specialty-ehr",
    listedOrder: 2,
    title: "Medical Specialty Text Classification",
    competitionName: "MIMIC-III Specialty NLP",
    domain: "EHR",
    task: "Classification",
    challenge: "Class Imbalance",
    sotaModel: "BioBERT",
    lossName: "Focal Loss",
    lossFormula:
      "$\\mathrm{FL}(p_{t}) = -\\alpha_{t} (1 - p_{t})^{\\gamma} \\log(p_{t})$",
    metricName: "Macro F1",
    metricValue: "0.84",
    paperUrl: "https://arxiv.org/abs/1904.03323",
    colabUrl:
      "https://colab.research.google.com/github/huggingface/notebooks/blob/main/examples/text_classification.ipynb",
    codeSnippets: {
      model: `import torch
from transformers import AutoModelForSequenceClassification, AutoTokenizer

tokenizer = AutoTokenizer.from_pretrained("emilyalsentzer/Bio_ClinicalBERT")
model = AutoModelForSequenceClassification.from_pretrained(
    "emilyalsentzer/Bio_ClinicalBERT",
    num_labels=20,
)`,
      loss: `import torch.nn as nn
import torch.nn.functional as F

class FocalLoss(nn.Module):
    def __init__(self, alpha=0.25, gamma=2.0):
        super().__init__()
        self.alpha = alpha
        self.gamma = gamma

    def forward(self, logits, targets):
        ce = F.cross_entropy(logits, targets, reduction="none")
        pt = torch.exp(-ce)
        return (self.alpha * (1 - pt) ** self.gamma * ce).mean()

focal = FocalLoss(gamma=2.0, alpha=0.25)`,
      augmentation: `import torch

def clinical_text_augment(
    input_ids: torch.Tensor,
    attention_mask: torch.Tensor,
    mask_prob: float = 0.15,
) -> tuple[torch.Tensor, torch.Tensor]:
    """Token masking for EHR notes (MIMIC-style robustness)."""
    mask = torch.rand(input_ids.shape) < mask_prob
    input_ids = input_ids.clone()
    input_ids[mask & attention_mask.bool()] = tokenizer.mask_token_id
    return input_ids, attention_mask`,
    },
  },
  {
    id: "rsna-pneumonia",
    listedOrder: 3,
    title: "RSNA Pneumonia Detection Challenge",
    competitionName: "RSNA Pneumonia Detection",
    domain: "2D Image",
    task: "Object Detection",
    challenge: "Noisy Label",
    sotaModel: "EfficientDet",
    lossName: "CIoU Loss",
    lossFormula:
      "$\\mathrm{CIoU} = \\mathrm{IoU} - \\frac{d^{2}}{c^{2}} - \\alpha v$",
    metricName: "mAP @ IoU 0.5",
    metricValue: "0.27",
    paperUrl: "https://arxiv.org/abs/1911.08287",
    colabUrl:
      "https://colab.research.google.com/github/pytorch/vision/blob/main/references/detection/train.py",
    codeSnippets: {
      model: `import torch
import torch.nn as nn
from torchvision.models import efficientnet_b0

class PneumoniaDetector(nn.Module):
    def __init__(self, num_classes=2):
        super().__init__()
        backbone = efficientnet_b0(weights="IMAGENET1K_V1")
        self.backbone = backbone.features
        self.head = nn.Conv2d(1280, num_classes * 4, kernel_size=1)

    def forward(self, x):
        return self.head(self.backbone(x))`,
      loss: `import torch

def ciou_loss(pred_boxes, target_boxes, eps=1e-7):
    """CIoU: IoU minus normalized center distance d^2 / c^2."""
    px1, py1, px2, py2 = pred_boxes.unbind(-1)
    tx1, ty1, tx2, ty2 = target_boxes.unbind(-1)

    inter = (
        (torch.min(px2, tx2) - torch.max(px1, tx1)).clamp(0)
        * (torch.min(py2, ty2) - torch.max(py1, ty1)).clamp(0)
    )
    union = (px2 - px1) * (py2 - py1) + (tx2 - tx1) * (ty2 - ty1) - inter + eps
    iou = inter / union

    cx_p, cy_p = (px1 + px2) / 2, (py1 + py2) / 2
    cx_t, cy_t = (tx1 + tx2) / 2, (ty1 + ty2) / 2
    d2 = (cx_p - cx_t) ** 2 + (cy_p - cy_t) ** 2
    c2 = (
        (torch.max(px2, tx2) - torch.min(px1, tx1)) ** 2
        + (torch.max(py2, ty2) - torch.min(py1, ty1)) ** 2
        + eps
    )
    return (1 - iou + d2 / c2).mean()`,
      augmentation: `import torch
import torchvision.transforms as T

chest_xray_augment = T.Compose([
    T.RandomHorizontalFlip(p=0.5),
    T.RandomAffine(degrees=7, translate=(0.05, 0.05), scale=(0.95, 1.05)),
    T.ColorJitter(brightness=0.15, contrast=0.15),
    # Simulates noisy RSNA label robustness
    T.Lambda(lambda x: x + torch.randn_like(x) * 0.02),
])`,
    },
  },
  {
    id: "ptb-xl-ecg",
    listedOrder: 4,
    title: "PTB-XL ECG Arrhythmia Classification",
    competitionName: "PTB-XL 12-Lead ECG",
    domain: "Biosignal",
    task: "Classification",
    challenge: "Class Imbalance",
    sotaModel: "1D ResNet",
    lossName: "Weighted BCE Loss",
    lossFormula:
      "$\\mathcal{L}_{wBCE} = -\\sum_{c} w_{c} \\left[ y_{c} \\log \\sigma(\\hat{y}_{c}) + (1-y_{c})\\log(1-\\sigma(\\hat{y}_{c})) \\right]$",
    metricName: "Macro AUROC",
    metricValue: "0.93",
    paperUrl: "https://arxiv.org/abs/2004.06107",
    colabUrl:
      "https://colab.research.google.com/github/helme/ptbxl_benchmarking/blob/master/notebooks/1d_cnn_baseline.ipynb",
    codeSnippets: {
      model: `import torch
import torch.nn as nn
import torch.nn.functional as F

class ResBlock1D(nn.Module):
    def __init__(self, channels):
        super().__init__()
        self.conv1 = nn.Conv1d(channels, channels, kernel_size=7, padding=3)
        self.conv2 = nn.Conv1d(channels, channels, kernel_size=7, padding=3)
        self.bn1 = nn.BatchNorm1d(channels)
        self.bn2 = nn.BatchNorm1d(channels)

    def forward(self, x):
        residual = x
        x = F.relu(self.bn1(self.conv1(x)))
        x = self.bn2(self.conv2(x))
        return F.relu(x + residual)

class ECGResNet1D(nn.Module):
    def __init__(self, in_channels=12, num_classes=5):
        super().__init__()
        self.stem = nn.Conv1d(in_channels, 64, kernel_size=15, stride=2, padding=7)
        self.blocks = nn.Sequential(
            ResBlock1D(64), ResBlock1D(64), ResBlock1D(64),
        )
        self.pool = nn.AdaptiveAvgPool1d(1)
        self.fc = nn.Linear(64, num_classes)

    def forward(self, x):
        x = F.relu(self.stem(x))
        x = self.blocks(x)
        return self.fc(self.pool(x).squeeze(-1))`,
      loss: `import torch
import torch.nn as nn

class_weights = torch.tensor([0.4, 2.1, 3.8, 5.2, 1.6])
criterion = nn.BCEWithLogitsLoss(pos_weight=class_weights)`,
      augmentation: `import torch

def ecg_signal_augment(waveform: torch.Tensor) -> torch.Tensor:
    """PTB-XL 12-lead augmentation: scale, shift, Gaussian noise."""
    scale = 0.9 + torch.rand(1).item() * 0.2
    shift = int(torch.randint(-25, 26, (1,)).item())
    noisy = waveform * scale
    noisy = torch.roll(noisy, shifts=shift, dims=-1)
    return noisy + torch.randn_like(noisy) * 0.01`,
    },
  },
  {
    id: "rsna-miccai-radiogenomics",
    listedOrder: 5,
    title: "RSNA-MICCAI Brain Tumor Radiogenomics",
    competitionName: "RSNA-MICCAI Brain Tumor",
    domain: "3D Image",
    task: "Classification",
    challenge: "Small Dataset",
    sotaModel: "ResNet3D",
    lossName: "Cross Entropy",
    lossFormula:
      "$\\mathcal{L}_{\\mathrm{CE}} = -\\sum_{c=1}^{C} y_{c} \\log(\\mathrm{softmax}(\\hat{y})_{c})$",
    metricName: "Balanced Accuracy",
    metricValue: "0.78",
    paperUrl: "https://arxiv.org/abs/2102.12332",
    colabUrl:
      "https://colab.research.google.com/github/Project-MONAI/tutorials/blob/main/3d_classification/brats_classification.ipynb",
    codeSnippets: {
      model: `import torch
import torch.nn as nn
from monai.networks.nets import resnet18

class VolumeClassifier3D(nn.Module):
    def __init__(self, num_classes=3):
        super().__init__()
        self.encoder = resnet18(
            spatial_dims=3,
            n_input_channels=4,
            num_classes=num_classes,
        )

    def forward(self, x):
        return self.encoder(x)

model = VolumeClassifier3D(num_classes=3).cuda()`,
      loss: `import torch.nn as nn

criterion = nn.CrossEntropyLoss(label_smoothing=0.1)
optimizer = torch.optim.AdamW(model.parameters(), lr=1e-4)`,
      augmentation: `from monai.transforms import (
    Compose, LoadImaged, EnsureChannelFirstd,
    Orientationd, Spacingd, ScaleIntensityRanged,
    RandAffined, ToTensord,
)

train_transforms = Compose([
    LoadImaged(keys=["image"]),
    EnsureChannelFirstd(keys=["image"]),
    Orientationd(keys=["image"], axcodes="RAS"),
    Spacingd(keys=["image"], pixdim=(1.0, 1.0, 1.0), mode="bilinear"),
    ScaleIntensityRanged(
        keys=["image"], a_min=-100, a_max=300,
        b_min=0.0, b_max=1.0, clip=True,
    ),
    RandAffined(
        keys=["image"], prob=0.3,
        rotate_range=(0.1, 0.1, 0.1),
        scale_range=(0.1, 0.1, 0.1),
        mode="bilinear", padding_mode="zeros",
    ),
    ToTensord(keys=["image"]),
])`,
    },
  },
];

/** Primary export alias used by the dashboard filter pipeline */
export const mockKaggleData = MOCK_KAGGLE_DATA;

export const DOMAIN_OPTIONS: DomainFilter[] = [
  "All",
  "3D Image",
  "2D Image",
  "EHR",
  "Biosignal",
];

export const TASK_OPTIONS: TaskFilter[] = [
  "All",
  "Segmentation",
  "Classification",
  "Object Detection",
];

export const CHALLENGE_OPTIONS: ChallengeFilter[] = [
  "All",
  "Class Imbalance",
  "Small Dataset",
  "Noisy Label",
];

export function filterCompetitions(
  data: KaggleCompetition[],
  domain: DomainFilter,
  task: TaskFilter,
  challenge: ChallengeFilter,
): KaggleCompetition[] {
  return data.filter((item) => {
    if (domain !== "All" && item.domain !== domain) return false;
    if (task !== "All" && item.task !== task) return false;
    if (challenge !== "All" && item.challenge !== challenge) return false;
    return true;
  });
}

export interface SotaModelStat {
  model: string;
  count: number;
  percentage: number;
}

export function computeSotaModelStats(
  competitions: KaggleCompetition[],
): SotaModelStat[] {
  if (competitions.length === 0) return [];

  const counts = new Map<string, number>();
  for (const c of competitions) {
    counts.set(c.sotaModel, (counts.get(c.sotaModel) ?? 0) + 1);
  }

  const total = competitions.length;
  return Array.from(counts.entries())
    .map(([model, count]) => ({
      model,
      count,
      percentage: Math.round((count / total) * 100),
    }))
    .sort((a, b) => b.count - a.count);
}
