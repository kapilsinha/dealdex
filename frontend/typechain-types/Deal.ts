/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import {
  BaseContract,
  BigNumber,
  BigNumberish,
  BytesLike,
  CallOverrides,
  ContractTransaction,
  Overrides,
  PopulatedTransaction,
  Signer,
  utils,
} from "ethers";
import { FunctionFragment, Result, EventFragment } from "@ethersproject/abi";
import { Listener, Provider } from "@ethersproject/providers";
import { TypedEventFilter, TypedEvent, TypedListener, OnEvent } from "./common";

export type ParticipantAddressesStruct = {
  dealdex: string;
  manager: string;
  project: string;
};

export type ParticipantAddressesStructOutput = [string, string, string] & {
  dealdex: string;
  manager: string;
  project: string;
};

export type ExchangeRateStruct = {
  numerator: BigNumberish;
  denominator: BigNumberish;
};

export type ExchangeRateStructOutput = [BigNumber, BigNumber] & {
  numerator: BigNumber;
  denominator: BigNumber;
};

export type InvestmentSizeConstraintsStruct = {
  minInvestmentPerInvestor: BigNumberish;
  maxInvestmentPerInvestor: BigNumberish;
  minTotalInvestment: BigNumberish;
  maxTotalInvestment: BigNumberish;
};

export type InvestmentSizeConstraintsStructOutput = [
  BigNumber,
  BigNumber,
  BigNumber,
  BigNumber
] & {
  minInvestmentPerInvestor: BigNumber;
  maxInvestmentPerInvestor: BigNumber;
  minTotalInvestment: BigNumber;
  maxTotalInvestment: BigNumber;
};

export type InvestConfigStruct = {
  sizeConstraints: InvestmentSizeConstraintsStruct;
  lockConstraint: BigNumberish;
  investmentTokenAddress: string;
  gateToken: string;
  investmentKeyType: BigNumberish;
  investmentDeadline: BigNumberish;
};

export type InvestConfigStructOutput = [
  InvestmentSizeConstraintsStructOutput,
  number,
  string,
  string,
  number,
  BigNumber
] & {
  sizeConstraints: InvestmentSizeConstraintsStructOutput;
  lockConstraint: number;
  investmentTokenAddress: string;
  gateToken: string;
  investmentKeyType: number;
  investmentDeadline: BigNumber;
};

export type ClaimRefundConfigStruct = {
  allowRefunds: boolean;
  lockConstraint: BigNumberish;
};

export type ClaimRefundConfigStructOutput = [boolean, number] & {
  allowRefunds: boolean;
  lockConstraint: number;
};

export type ClaimTokensConfigStruct = {
  projectTokenAddress: string;
  dealdexFeeBps: BigNumberish;
  managerFeeBps: BigNumberish;
  lockConstraint: BigNumberish;
};

export type ClaimTokensConfigStructOutput = [string, number, number, number] & {
  projectTokenAddress: string;
  dealdexFeeBps: number;
  managerFeeBps: number;
  lockConstraint: number;
};

export type ClaimFundsConfigStruct = {
  dealdexFeeBps: BigNumberish;
  managerFeeBps: BigNumberish;
  lockConstraint: BigNumberish;
};

export type ClaimFundsConfigStructOutput = [number, number, number] & {
  dealdexFeeBps: number;
  managerFeeBps: number;
  lockConstraint: number;
};

export type VestingScheduleStruct = {
  vestingStrategy: BigNumberish;
  vestingBps: BigNumberish[];
  vestingTimestamps: BigNumberish[];
};

export type VestingScheduleStructOutput = [number, number[], BigNumber[]] & {
  vestingStrategy: number;
  vestingBps: number[];
  vestingTimestamps: BigNumber[];
};

export type InvestmentKeyStruct = { addr: string; id: BigNumberish };

export type InvestmentKeyStructOutput = [string, BigNumber] & {
  addr: string;
  id: BigNumber;
};

export type DealConfigStruct = {
  participantAddresses: ParticipantAddressesStruct;
  exchangeRate: ExchangeRateStruct;
  investConfig: InvestConfigStruct;
  refundConfig: ClaimRefundConfigStruct;
  tokensConfig: ClaimTokensConfigStruct;
  fundsConfig: ClaimFundsConfigStruct;
  vestingSchedule: VestingScheduleStruct;
};

export type DealConfigStructOutput = [
  ParticipantAddressesStructOutput,
  ExchangeRateStructOutput,
  InvestConfigStructOutput,
  ClaimRefundConfigStructOutput,
  ClaimTokensConfigStructOutput,
  ClaimFundsConfigStructOutput,
  VestingScheduleStructOutput
] & {
  participantAddresses: ParticipantAddressesStructOutput;
  exchangeRate: ExchangeRateStructOutput;
  investConfig: InvestConfigStructOutput;
  refundConfig: ClaimRefundConfigStructOutput;
  tokensConfig: ClaimTokensConfigStructOutput;
  fundsConfig: ClaimFundsConfigStructOutput;
  vestingSchedule: VestingScheduleStructOutput;
};

export interface DealInterface extends utils.Interface {
  contractName: "Deal";
  functions: {
    "claimFunds()": FunctionFragment;
    "claimRefund(uint256)": FunctionFragment;
    "claimTokens(uint256)": FunctionFragment;
    "config()": FunctionFragment;
    "getInvestors()": FunctionFragment;
    "getTotalVestedTokens(uint256)": FunctionFragment;
    "init(((address,address,address),(uint256,uint256),((uint256,uint256,uint256,uint256),uint8,address,address,uint8,uint256),(bool,uint8),(address,uint16,uint16,uint8),(uint16,uint16,uint8),(uint8,uint16[],uint256[])))": FunctionFragment;
    "invest(uint256,uint256)": FunctionFragment;
    "investmentKeyToClaimedTokens(address,uint256)": FunctionFragment;
    "investmentKeyToReceivedDealdexFeeTokens(address,uint256)": FunctionFragment;
    "investmentKeyToReceivedFunds(address,uint256)": FunctionFragment;
    "investmentKeyToReceivedManagerFeeTokens(address,uint256)": FunctionFragment;
    "investmentKeys(uint256)": FunctionFragment;
    "isLocked()": FunctionFragment;
    "isLockedFlag()": FunctionFragment;
    "overrides()": FunctionFragment;
    "setDealDexFees(uint16,uint16)": FunctionFragment;
    "setForceAllowRefund(bool)": FunctionFragment;
    "setManagerFees(uint16,uint16)": FunctionFragment;
    "setProjectTokenDetails(address,uint256,uint256)": FunctionFragment;
    "totalReceivedInvestment()": FunctionFragment;
  };

  encodeFunctionData(
    functionFragment: "claimFunds",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "claimRefund",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "claimTokens",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(functionFragment: "config", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "getInvestors",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "getTotalVestedTokens",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "init",
    values: [DealConfigStruct]
  ): string;
  encodeFunctionData(
    functionFragment: "invest",
    values: [BigNumberish, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "investmentKeyToClaimedTokens",
    values: [string, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "investmentKeyToReceivedDealdexFeeTokens",
    values: [string, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "investmentKeyToReceivedFunds",
    values: [string, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "investmentKeyToReceivedManagerFeeTokens",
    values: [string, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "investmentKeys",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(functionFragment: "isLocked", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "isLockedFlag",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "overrides", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "setDealDexFees",
    values: [BigNumberish, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "setForceAllowRefund",
    values: [boolean]
  ): string;
  encodeFunctionData(
    functionFragment: "setManagerFees",
    values: [BigNumberish, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "setProjectTokenDetails",
    values: [string, BigNumberish, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "totalReceivedInvestment",
    values?: undefined
  ): string;

  decodeFunctionResult(functionFragment: "claimFunds", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "claimRefund",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "claimTokens",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "config", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "getInvestors",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getTotalVestedTokens",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "init", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "invest", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "investmentKeyToClaimedTokens",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "investmentKeyToReceivedDealdexFeeTokens",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "investmentKeyToReceivedFunds",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "investmentKeyToReceivedManagerFeeTokens",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "investmentKeys",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "isLocked", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "isLockedFlag",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "overrides", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "setDealDexFees",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setForceAllowRefund",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setManagerFees",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setProjectTokenDetails",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "totalReceivedInvestment",
    data: BytesLike
  ): Result;

  events: {
    "InvestUpdate(address,uint256,uint256,uint256)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "InvestUpdate"): EventFragment;
}

export type InvestUpdateEvent = TypedEvent<
  [string, BigNumber, BigNumber, BigNumber],
  {
    investor: string;
    nftId: BigNumber;
    investedAmt: BigNumber;
    totalFunds: BigNumber;
  }
>;

export type InvestUpdateEventFilter = TypedEventFilter<InvestUpdateEvent>;

export interface Deal extends BaseContract {
  contractName: "Deal";
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: DealInterface;

  queryFilter<TEvent extends TypedEvent>(
    event: TypedEventFilter<TEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TEvent>>;

  listeners<TEvent extends TypedEvent>(
    eventFilter?: TypedEventFilter<TEvent>
  ): Array<TypedListener<TEvent>>;
  listeners(eventName?: string): Array<Listener>;
  removeAllListeners<TEvent extends TypedEvent>(
    eventFilter: TypedEventFilter<TEvent>
  ): this;
  removeAllListeners(eventName?: string): this;
  off: OnEvent<this>;
  on: OnEvent<this>;
  once: OnEvent<this>;
  removeListener: OnEvent<this>;

  functions: {
    claimFunds(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    claimRefund(
      id: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    claimTokens(
      id: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    config(
      overrides?: CallOverrides
    ): Promise<
      [
        ParticipantAddressesStructOutput,
        ExchangeRateStructOutput,
        InvestConfigStructOutput,
        ClaimRefundConfigStructOutput,
        ClaimTokensConfigStructOutput,
        ClaimFundsConfigStructOutput,
        VestingScheduleStructOutput
      ] & {
        participantAddresses: ParticipantAddressesStructOutput;
        exchangeRate: ExchangeRateStructOutput;
        investConfig: InvestConfigStructOutput;
        refundConfig: ClaimRefundConfigStructOutput;
        tokensConfig: ClaimTokensConfigStructOutput;
        fundsConfig: ClaimFundsConfigStructOutput;
        vestingSchedule: VestingScheduleStructOutput;
      }
    >;

    getInvestors(
      overrides?: CallOverrides
    ): Promise<
      [
        InvestmentKeyStructOutput[],
        BigNumber[],
        BigNumber[],
        BigNumber[],
        BigNumber[]
      ] & {
        _investmentKeys: InvestmentKeyStructOutput[];
        _investments: BigNumber[];
        _claimedTokens: BigNumber[];
        _managerFeeTokens: BigNumber[];
        _dealdexFeeTokens: BigNumber[];
      }
    >;

    getTotalVestedTokens(
      id: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    init(
      _dealConfig: DealConfigStruct,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    invest(
      amount: BigNumberish,
      id: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    investmentKeyToClaimedTokens(
      arg0: string,
      arg1: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    investmentKeyToReceivedDealdexFeeTokens(
      arg0: string,
      arg1: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    investmentKeyToReceivedFunds(
      arg0: string,
      arg1: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    investmentKeyToReceivedManagerFeeTokens(
      arg0: string,
      arg1: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    investmentKeys(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[string, BigNumber] & { addr: string; id: BigNumber }>;

    isLocked(overrides?: CallOverrides): Promise<[boolean]>;

    isLockedFlag(overrides?: CallOverrides): Promise<[boolean]>;

    overrides(
      overrides?: CallOverrides
    ): Promise<[boolean] & { forceAllowRefunds: boolean }>;

    setDealDexFees(
      fundFeeBps: BigNumberish,
      tokenFeeBps: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    setForceAllowRefund(
      val: boolean,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    setManagerFees(
      fundFeeBps: BigNumberish,
      tokenFeeBps: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    setProjectTokenDetails(
      _projectTokenAddress: string,
      _exchangeRateNum: BigNumberish,
      _exchangeRateDenom: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    totalReceivedInvestment(overrides?: CallOverrides): Promise<[BigNumber]>;
  };

  claimFunds(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  claimRefund(
    id: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  claimTokens(
    id: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  config(
    overrides?: CallOverrides
  ): Promise<
    [
      ParticipantAddressesStructOutput,
      ExchangeRateStructOutput,
      InvestConfigStructOutput,
      ClaimRefundConfigStructOutput,
      ClaimTokensConfigStructOutput,
      ClaimFundsConfigStructOutput,
      VestingScheduleStructOutput
    ] & {
      participantAddresses: ParticipantAddressesStructOutput;
      exchangeRate: ExchangeRateStructOutput;
      investConfig: InvestConfigStructOutput;
      refundConfig: ClaimRefundConfigStructOutput;
      tokensConfig: ClaimTokensConfigStructOutput;
      fundsConfig: ClaimFundsConfigStructOutput;
      vestingSchedule: VestingScheduleStructOutput;
    }
  >;

  getInvestors(
    overrides?: CallOverrides
  ): Promise<
    [
      InvestmentKeyStructOutput[],
      BigNumber[],
      BigNumber[],
      BigNumber[],
      BigNumber[]
    ] & {
      _investmentKeys: InvestmentKeyStructOutput[];
      _investments: BigNumber[];
      _claimedTokens: BigNumber[];
      _managerFeeTokens: BigNumber[];
      _dealdexFeeTokens: BigNumber[];
    }
  >;

  getTotalVestedTokens(
    id: BigNumberish,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  init(
    _dealConfig: DealConfigStruct,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  invest(
    amount: BigNumberish,
    id: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  investmentKeyToClaimedTokens(
    arg0: string,
    arg1: BigNumberish,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  investmentKeyToReceivedDealdexFeeTokens(
    arg0: string,
    arg1: BigNumberish,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  investmentKeyToReceivedFunds(
    arg0: string,
    arg1: BigNumberish,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  investmentKeyToReceivedManagerFeeTokens(
    arg0: string,
    arg1: BigNumberish,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  investmentKeys(
    arg0: BigNumberish,
    overrides?: CallOverrides
  ): Promise<[string, BigNumber] & { addr: string; id: BigNumber }>;

  isLocked(overrides?: CallOverrides): Promise<boolean>;

  isLockedFlag(overrides?: CallOverrides): Promise<boolean>;

  overrides(overrides?: CallOverrides): Promise<boolean>;

  setDealDexFees(
    fundFeeBps: BigNumberish,
    tokenFeeBps: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  setForceAllowRefund(
    val: boolean,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  setManagerFees(
    fundFeeBps: BigNumberish,
    tokenFeeBps: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  setProjectTokenDetails(
    _projectTokenAddress: string,
    _exchangeRateNum: BigNumberish,
    _exchangeRateDenom: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  totalReceivedInvestment(overrides?: CallOverrides): Promise<BigNumber>;

  callStatic: {
    claimFunds(overrides?: CallOverrides): Promise<void>;

    claimRefund(id: BigNumberish, overrides?: CallOverrides): Promise<void>;

    claimTokens(id: BigNumberish, overrides?: CallOverrides): Promise<void>;

    config(
      overrides?: CallOverrides
    ): Promise<
      [
        ParticipantAddressesStructOutput,
        ExchangeRateStructOutput,
        InvestConfigStructOutput,
        ClaimRefundConfigStructOutput,
        ClaimTokensConfigStructOutput,
        ClaimFundsConfigStructOutput,
        VestingScheduleStructOutput
      ] & {
        participantAddresses: ParticipantAddressesStructOutput;
        exchangeRate: ExchangeRateStructOutput;
        investConfig: InvestConfigStructOutput;
        refundConfig: ClaimRefundConfigStructOutput;
        tokensConfig: ClaimTokensConfigStructOutput;
        fundsConfig: ClaimFundsConfigStructOutput;
        vestingSchedule: VestingScheduleStructOutput;
      }
    >;

    getInvestors(
      overrides?: CallOverrides
    ): Promise<
      [
        InvestmentKeyStructOutput[],
        BigNumber[],
        BigNumber[],
        BigNumber[],
        BigNumber[]
      ] & {
        _investmentKeys: InvestmentKeyStructOutput[];
        _investments: BigNumber[];
        _claimedTokens: BigNumber[];
        _managerFeeTokens: BigNumber[];
        _dealdexFeeTokens: BigNumber[];
      }
    >;

    getTotalVestedTokens(
      id: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    init(
      _dealConfig: DealConfigStruct,
      overrides?: CallOverrides
    ): Promise<void>;

    invest(
      amount: BigNumberish,
      id: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    investmentKeyToClaimedTokens(
      arg0: string,
      arg1: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    investmentKeyToReceivedDealdexFeeTokens(
      arg0: string,
      arg1: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    investmentKeyToReceivedFunds(
      arg0: string,
      arg1: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    investmentKeyToReceivedManagerFeeTokens(
      arg0: string,
      arg1: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    investmentKeys(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[string, BigNumber] & { addr: string; id: BigNumber }>;

    isLocked(overrides?: CallOverrides): Promise<boolean>;

    isLockedFlag(overrides?: CallOverrides): Promise<boolean>;

    overrides(overrides?: CallOverrides): Promise<boolean>;

    setDealDexFees(
      fundFeeBps: BigNumberish,
      tokenFeeBps: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    setForceAllowRefund(val: boolean, overrides?: CallOverrides): Promise<void>;

    setManagerFees(
      fundFeeBps: BigNumberish,
      tokenFeeBps: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    setProjectTokenDetails(
      _projectTokenAddress: string,
      _exchangeRateNum: BigNumberish,
      _exchangeRateDenom: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    totalReceivedInvestment(overrides?: CallOverrides): Promise<BigNumber>;
  };

  filters: {
    "InvestUpdate(address,uint256,uint256,uint256)"(
      investor?: string | null,
      nftId?: BigNumberish | null,
      investedAmt?: null,
      totalFunds?: null
    ): InvestUpdateEventFilter;
    InvestUpdate(
      investor?: string | null,
      nftId?: BigNumberish | null,
      investedAmt?: null,
      totalFunds?: null
    ): InvestUpdateEventFilter;
  };

  estimateGas: {
    claimFunds(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    claimRefund(
      id: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    claimTokens(
      id: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    config(overrides?: CallOverrides): Promise<BigNumber>;

    getInvestors(overrides?: CallOverrides): Promise<BigNumber>;

    getTotalVestedTokens(
      id: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    init(
      _dealConfig: DealConfigStruct,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    invest(
      amount: BigNumberish,
      id: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    investmentKeyToClaimedTokens(
      arg0: string,
      arg1: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    investmentKeyToReceivedDealdexFeeTokens(
      arg0: string,
      arg1: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    investmentKeyToReceivedFunds(
      arg0: string,
      arg1: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    investmentKeyToReceivedManagerFeeTokens(
      arg0: string,
      arg1: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    investmentKeys(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    isLocked(overrides?: CallOverrides): Promise<BigNumber>;

    isLockedFlag(overrides?: CallOverrides): Promise<BigNumber>;

    overrides(overrides?: CallOverrides): Promise<BigNumber>;

    setDealDexFees(
      fundFeeBps: BigNumberish,
      tokenFeeBps: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    setForceAllowRefund(
      val: boolean,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    setManagerFees(
      fundFeeBps: BigNumberish,
      tokenFeeBps: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    setProjectTokenDetails(
      _projectTokenAddress: string,
      _exchangeRateNum: BigNumberish,
      _exchangeRateDenom: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    totalReceivedInvestment(overrides?: CallOverrides): Promise<BigNumber>;
  };

  populateTransaction: {
    claimFunds(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    claimRefund(
      id: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    claimTokens(
      id: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    config(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    getInvestors(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    getTotalVestedTokens(
      id: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    init(
      _dealConfig: DealConfigStruct,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    invest(
      amount: BigNumberish,
      id: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    investmentKeyToClaimedTokens(
      arg0: string,
      arg1: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    investmentKeyToReceivedDealdexFeeTokens(
      arg0: string,
      arg1: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    investmentKeyToReceivedFunds(
      arg0: string,
      arg1: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    investmentKeyToReceivedManagerFeeTokens(
      arg0: string,
      arg1: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    investmentKeys(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    isLocked(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    isLockedFlag(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    overrides(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    setDealDexFees(
      fundFeeBps: BigNumberish,
      tokenFeeBps: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    setForceAllowRefund(
      val: boolean,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    setManagerFees(
      fundFeeBps: BigNumberish,
      tokenFeeBps: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    setProjectTokenDetails(
      _projectTokenAddress: string,
      _exchangeRateNum: BigNumberish,
      _exchangeRateDenom: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    totalReceivedInvestment(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;
  };
}