export interface NavPoint {
  month: string;
  nav: number;
}

export interface PortfolioCompany {
  id: string;
  name: string;
  sector: string;
  country: string;
  revenue: number;
  ebitda: number;
  ebitdaMargin: number;
  status: string;
  investmentDate: string;
  investedCapital: number;
  currentValue: number;
  flags: string[];
}

export interface FundMetrics {
  irr: number;
  tvpi: number;
  dpi: number;
  rvpi: number;
  nav: number;
}

export interface Fund {
  id: string;
  name: string;
  type: string;
  vintage: number;
  totalCommitments: number;
  metrics: FundMetrics;
  navHistory: NavPoint[];
  portfolioCompanies: PortfolioCompany[];
}

export interface FundsData {
  funds: Fund[];
}
