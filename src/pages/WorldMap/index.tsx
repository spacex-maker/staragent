import React, { useState, useCallback } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import styled from 'styled-components';
import { Helmet } from 'react-helmet';
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup
} from "react-simple-maps";
import { Tooltip, Radio } from 'antd';
import SimpleHeader from '../../components/headers/simple';

const PageContainer = styled.div`
  min-height: 100vh;
  height: 100vh;
  background: ${props => props.theme.mode === 'dark' 
    ? 'var(--ant-color-bg-container)' 
    : '#f5f7fa'};
  position: relative;
  overflow: hidden;
`;

const ContentWrapper = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
`;

const fadeOutKeyframes = `
  @keyframes fadeOut {
    0% {
      opacity: 1;
      transform: translateX(-50%) scale(1);
      width: auto;
      padding: 0.8rem 2rem;
    }
    50% {
      opacity: 0.8;
      transform: translateX(-50%) scale(0.8);
      width: 40px;
      padding: 0.8rem;
    }
    100% {
      opacity: 0;
      transform: translateX(-50%) scale(0);
      width: 0;
      padding: 0;
    }
  }
`;

const fadeInKeyframes = `
  @keyframes fadeIn {
    0% {
      opacity: 0;
      transform: translateX(-50%) scale(0);
      width: 0;
      padding: 0;
    }
    50% {
      opacity: 0.8;
      transform: translateX(-50%) scale(0.8);
      width: 40px;
      padding: 0.8rem;
    }
    100% {
      opacity: 1;
      transform: translateX(-50%) scale(1);
      width: auto;
      padding: 0.8rem 2rem;
    }
  }
`;

interface CountryNameProps {
  $visible: boolean;
}

const CountryName = styled.div<CountryNameProps>`
  ${fadeOutKeyframes}
  ${fadeInKeyframes}
  position: fixed;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%) scale(${props => props.$visible ? 1 : 0});
  font-size: 1.2rem;
  color: var(--ant-color-text);
  background: ${props => props.theme.mode === 'dark' ? 'rgba(0, 0, 0, 0.85)' : 'rgba(255, 255, 255, 0.95)'};
  padding: ${props => props.$visible ? '0.8rem 2rem' : '0'};
  border-radius: 30px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  backdrop-filter: blur(8px);
  white-space: nowrap;
  border: 1px solid ${props => props.theme.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'};
  overflow: hidden;
  animation: ${props => props.$visible ? 'fadeIn' : 'fadeOut'} 0.3s ease-in-out forwards;
  
  span {
    color: var(--ant-color-primary);
    margin-left: 0.5rem;
  }
`;

const MapContainer = styled.div`
  width: 100%;
  height: 100vh;
  position: relative;
  overflow: hidden;
  
  & > svg {
    width: 100%;
    height: 100%;
  }
`;

const Legend = styled.div`
  position: absolute;
  bottom: 20px;
  right: 20px;
  background: ${props => props.theme.mode === 'dark' 
    ? 'rgba(0, 0, 0, 0.75)' 
    : 'rgba(255, 255, 255, 0.9)'};
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  z-index: 1000;
`;

const LegendItem = styled.div<{ color: string }>`
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;
  color: var(--ant-color-text);
  
  &:last-child {
    margin-bottom: 0;
  }
  
  &::before {
    content: '';
    display: inline-block;
    width: 12px;
    height: 12px;
    background-color: ${props => props.color};
    margin-right: 8px;
    border-radius: 2px;
  }
`;

const PlatformSelector = styled(Radio.Group)`
  position: fixed;
  top: 80px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;
  background: ${props => props.theme.mode === 'dark' ? 'rgba(0, 0, 0, 0.75)' : 'rgba(255, 255, 255, 0.9)'};
  padding: 0.5rem;
  border-radius: 30px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  backdrop-filter: blur(8px);
  display: flex;
  justify-content: center;
  gap: 1rem;

  .ant-radio-button-wrapper {
    border-radius: 20px;
    padding: 0 1.5rem;
    height: 36px;
    line-height: 34px;
    background: transparent;
    border-color: ${props => props.theme.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'};
    
    &:first-child {
      border-radius: 20px;
    }
    
    &:last-child {
      border-radius: 20px;
    }
    
    &::before {
      display: none;
    }

    &:hover {
      color: var(--ant-color-primary);
    }
  }

  .ant-radio-button-wrapper-checked {
    background: ${props => props.theme.mode === 'dark' ? 'rgba(0, 0, 0, 0.5)' : 'rgba(255, 255, 255, 0.9)'};
    border-color: var(--ant-color-primary);
    
    &::before {
      display: none;
    }
  }
`;

// AI平台支持的国家列表
const platformCountries = {
  deepseek: [
    // 亚洲
    "CHN", // 中国（含港澳台）
    "TWN", // 台湾
    "HKG", // 香港
    "MAC", // 澳门
    "JPN", // 日本
    "KOR", // 韩国
    "SGP", // 新加坡
    "MYS", // 马来西亚
    "THA", // 泰国
    "VNM", // 越南
    "PHL", // 菲律宾
    "IND", // 印度
    "IDN", // 印度尼西亚
    "ISR", // 以色列
    "TUR", // 土耳其

    // 欧洲
    "GBR", // 英国
    "DEU", // 德国
    "FRA", // 法国
    "ITA", // 意大利
    "ESP", // 西班牙
    "NLD", // 荷兰
    "CHE", // 瑞士
    "SWE", // 瑞典
    "NOR", // 挪威
    "FIN", // 芬兰
    "DNK", // 丹麦
    "BEL", // 比利时
    "AUT", // 奥地利
    "IRL", // 爱尔兰
    "PRT", // 葡萄牙

    // 北美
    "USA", // 美国
    "CAN", // 加拿大
    "MEX", // 墨西哥

    // 南美
    "BRA", // 巴西
    "ARG", // 阿根廷
    "CHL", // 智利
    "COL", // 哥伦比亚
    "PER", // 秘鲁

    // 大洋洲
    "AUS", // 澳大利亚
    "NZL", // 新西兰

    // 非洲
    "ZAF", // 南非
    "EGY", // 埃及
    "NGA", // 尼日利亚
    "KEN", // 肯尼亚

    // 中东
    "ARE", // 阿联酋（迪拜）
    "SAU", // 沙特阿拉伯
    "QAT", // 卡塔尔
    "KWT"  // 科威特
  ],
  chatgpt: [
    "ALB", "DZA", "AFG", "AND", "AGO", "ATG", "ARG", "ARM", "AUS", "AUT", "AZE", "BHS", "BHR", "BGD", 
    "BRB", "BEL", "BLZ", "BEN", "BTN", "BOL", "BIH", "BWA", "BRA", "BRN", "BGR", "BFA", "BDI", "CPV", 
    "KHM", "CMR", "CAN", "CAF", "TCD", "CHL", "COL", "COM", "COG", "COD", "CRI", "CIV", "HRV", "CYP", 
    "CZE", "DNK", "DJI", "DMA", "DOM", "ECU", "EGY", "SLV", "GNQ", "ERI", "EST", "SWZ", "ETH", "FJI", 
    "FIN", "FRA", "GAB", "GMB", "GEO", "DEU", "GHA", "GRC", "GRD", "GTM", "GIN", "GNB", "GUY", "HTI", 
    "VAT", "HND", "HUN", "ISL", "IND", "IDN", "IRQ", "IRL", "ISR", "ITA", "JAM", "JPN", "JOR", "KAZ", 
    "KEN", "KIR", "KWT", "KGZ", "LAO", "LVA", "LBN", "LSO", "LBR", "LBY", "LIE", "LTU", "LUX", "MDG", 
    "MWI", "MYS", "MDV", "MLI", "MLT", "MHL", "MRT", "MUS", "MEX", "FSM", "MDA", "MCO", "MNG", "MNE", 
    "MAR", "MOZ", "MMR", "NAM", "NRU", "NPL", "NLD", "NZL", "NIC", "NER", "NGA", "MKD", "NOR", "OMN", 
    "PAK", "PLW", "PSE", "PAN", "PNG", "PRY", "PER", "PHL", "POL", "PRT", "QAT", "ROU", "RWA", "KNA", 
    "LCA", "VCT", "WSM", "SMR", "STP", "SAU", "SEN", "SRB", "SYC", "SLE", "SGP", "SVK", "SVN", "SLB", 
    "SOM", "ZAF", "KOR", "SSD", "ESP", "LKA", "SUR", "SWE", "CHE", "SDN", "TWN", "TJK", "TZA", "THA", 
    "TLS", "TGO", "TON", "TTO", "TUN", "TUR", "TKM", "TUV", "UGA", "UKR", "ARE", "GBR", "USA", "URY", 
    "UZB", "VUT", "VNM", "YEM", "ZMB", "ZWE"
  ],
  grok: [
    "USA", // 美国
    "CAN", // 加拿大
    "AUS", // 澳大利亚
    "NZL", // 新西兰
    "PHL", // 菲律宾
    "SGP", // 新加坡
    "IND", // 印度

    // 2025年2月Android Beta版新增
    "SAU", // 沙特阿拉伯

    // 2025年3月确认和预测
    "ITA", // 意大利
    "FRA", // 法国
    "ARE", // 阿联酋
    "THA", // 泰国
    "DEU", // 德国
    "ESP", // 西班牙

    // 原有支持的国家
    "BHS", "BRB", "BLZ", "BWA", "CMR", "DMA", "SWZ", "FJI", 
    "GMB", "GHA", "GRD", "GUY", "JAM", "KEN", "LBR", "MYS", 
    "MWI", "MLT", "MUS", "NAM", "NGA", "PAK", "PNG", "WSM", 
    "SYC", "SLE", "SLB", "ZAF", "LKA", "TZA", "TON", "TTO", 
    "TUV", "UGA", "VUT", "ZMB", "ZWE", "GBR", "JPN", "KOR"
  ]
};

// 国家颜色映射
const countryColors = {
  USA: '#3b82f6', // 美国 - 蓝色
  GBR: '#ef4444', // 英国 - 红色
  DEU: '#f59e0b', // 德国 - 橙色
  FRA: '#10b981', // 法国 - 绿色
  ITA: '#8b5cf6', // 意大利 - 紫色
  ESP: '#f97316', // 西班牙 - 橙红色
  JPN: '#ec4899', // 日本 - 粉色
  KOR: '#6366f1', // 韩国 - 靛蓝色
  CHN: '#dc2626', // 中国 - 深红色
  RUS: '#2563eb', // 俄罗斯 - 深蓝色
  BRA: '#059669', // 巴西 - 深绿色
  IND: '#7c3aed', // 印度 - 深紫色
  AUS: '#ea580c', // 澳大利亚 - 深橙色
  CAN: '#b91c1c', // 加拿大 - 暗红色
  NZL: '#047857', // 新西兰 - 森林绿
  SGP: '#4f46e5', // 新加坡 - 靛青色
  ARE: '#c2410c', // 阿联酋 - 赤褐色
  SAU: '#15803d', // 沙特 - 深绿色
  ZAF: '#7e22ce', // 南非 - 深紫色
  MEX: '#0369a1',  // 墨西哥 - 深青色
  TWN: '#dc2626'  // 中国台湾省 - 深红色
};

interface Position {
  coordinates: [number, number];
  zoom: number;
}

const WorldMap: React.FC = () => {
  const intl = useIntl();
  const [position, setPosition] = useState<Position>({
    coordinates: [0, 20],
    zoom: 1
  });
  const [selectedPlatform, setSelectedPlatform] = useState<'deepseek' | 'chatgpt' | 'grok'>('chatgpt');
  const [hoveredCountry, setHoveredCountry] = useState<string>('');

  const handleMoveEnd = useCallback((position: Position) => {
    setPosition(position);
  }, []);

  const getCountryStatus = useCallback((geo: any) => {
    const countryCode = geo.properties.iso_a3?.toUpperCase();
    // 处理台湾地区
    if (countryCode === 'TWN') {
      return {
        isSupported: platformCountries[selectedPlatform].includes('TWN'),
        name: '中国台湾省',
        color: countryColors['TWN']
      };
    }
    return {
      isSupported: platformCountries[selectedPlatform].includes(countryCode),
      name: geo.properties.name,
      color: countryColors[countryCode as keyof typeof countryColors]
    };
  }, [selectedPlatform]);

  return (
    <>
      <Helmet>
        <title>{intl.formatMessage({ id: 'worldmap.page.title' })}</title>
        <meta name="description" content="支持的国家和地区 - AIMateX" />
      </Helmet>
      
      <SimpleHeader />
      
      <PageContainer>
        <ContentWrapper>
          <PlatformSelector 
            value={selectedPlatform} 
            onChange={e => setSelectedPlatform(e.target.value)}
          >
            <Radio.Button value="deepseek">DeepSeek</Radio.Button>
            <Radio.Button value="chatgpt">ChatGPT</Radio.Button>
            <Radio.Button value="grok">Grok</Radio.Button>
          </PlatformSelector>

          <MapContainer>
            <ComposableMap
              width={1600}
              height={900}
              projection="geoMercator"
              projectionConfig={{
                scale: 200
              }}
              style={{
                width: "100%",
                height: "100%"
              }}
            >
              <ZoomableGroup
                center={position.coordinates}
                zoom={position.zoom}
                onMoveEnd={handleMoveEnd}
                maxZoom={4}
                minZoom={0.5}
              >
                <Geographies 
                  geography="/world-countries.json"
                  stroke="transparent"
                  strokeWidth={0}
                >
                  {({ geographies }) =>
                    geographies.map((geo) => {
                      const { isSupported, name, color } = getCountryStatus(geo);
                      return (
                        <Geography
                          key={geo.rsmKey}
                          geography={geo}
                          fill={isSupported 
                            ? 'var(--ant-color-primary)' 
                            : '#000000'}
                          stroke="transparent"
                          strokeWidth={0}
                          style={{
                            default: {
                              outline: 'none',
                              transition: 'all 250ms',
                            },
                            hover: {
                              fill: isSupported 
                                ? 'var(--ant-color-primary-hover)'
                                : '#1a1a1a',
                              outline: 'none',
                              cursor: 'pointer',
                              opacity: 0.9,
                              strokeWidth: 0
                            },
                            pressed: {
                              outline: 'none',
                              opacity: 0.8,
                            }
                          }}
                          onMouseEnter={() => {
                            setHoveredCountry(`${name}${isSupported ? ' (已支持)' : ''}`);
                          }}
                          onMouseLeave={() => {
                            setHoveredCountry('');
                          }}
                        />
                      );
                    })
                  }
                </Geographies>
              </ZoomableGroup>
            </ComposableMap>

            <Legend>
              <LegendItem color="var(--ant-color-primary)">
                <FormattedMessage id="worldmap.legend.supported" defaultMessage="已支持" />
              </LegendItem>
              <LegendItem color="#000000">
                <FormattedMessage id="worldmap.legend.unsupported" defaultMessage="未支持" />
              </LegendItem>
            </Legend>
          </MapContainer>

          <CountryName $visible={!!hoveredCountry}>
            {hoveredCountry && hoveredCountry.split('(').map((part, index) => 
              index === 0 ? part : <span key={index}>({part}</span>
            )}
          </CountryName>
        </ContentWrapper>
      </PageContainer>
    </>
  );
};

export default WorldMap; 