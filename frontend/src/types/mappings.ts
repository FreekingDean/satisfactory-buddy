export type ResourcePurity = 'impure' | 'normal' | 'pure';

export type ResourceType = 
  | 'Desc_NitrogenGas_C'
  | 'Desc_Water_C'
  | 'Desc_LiquidOilWell_C'
  | 'Desc_LiquidOil_C'
  | 'Desc_SAM_C'
  | 'Desc_Stone_C'
  | 'Desc_OreIron_C'
  | 'Desc_OreCopper_C'
  | 'Desc_OreGold_C'
  | 'Desc_Coal_C'
  | 'Desc_RawQuartz_C'
  | 'Desc_Sulfur_C'
  | 'Desc_OreBauxite_C'
  | 'Desc_OreUranium_C'
  | 'Desc_Geyser_C';

export interface ResourceNodeData {
  type: ResourceType;
  purity: ResourcePurity;
}

export type ResourceMappings = Record<string, ResourceNodeData>;