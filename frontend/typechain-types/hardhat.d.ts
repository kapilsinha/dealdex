/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { ethers } from "ethers";
import {
  FactoryOptions,
  HardhatEthersHelpers as HardhatEthersHelpersBase,
} from "@nomiclabs/hardhat-ethers/types";

import * as Contracts from ".";

declare module "hardhat/types/runtime" {
  interface HardhatEthersHelpers extends HardhatEthersHelpersBase {
    getContractFactory(
      name: "ERC20",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ERC20__factory>;
    getContractFactory(
      name: "IERC20Metadata",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC20Metadata__factory>;
    getContractFactory(
      name: "IERC20",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC20__factory>;
    getContractFactory(
      name: "ERC721",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ERC721__factory>;
    getContractFactory(
      name: "IERC721Metadata",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC721Metadata__factory>;
    getContractFactory(
      name: "IERC721",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC721__factory>;
    getContractFactory(
      name: "IERC721Receiver",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC721Receiver__factory>;
    getContractFactory(
      name: "ERC165",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ERC165__factory>;
    getContractFactory(
      name: "IERC165",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC165__factory>;
    getContractFactory(
      name: "IDeal",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IDeal__factory>;
    getContractFactory(
      name: "ILockableDeal",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ILockableDeal__factory>;
    getContractFactory(
      name: "Deal",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.Deal__factory>;
    getContractFactory(
      name: "DealFactory",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.DealFactory__factory>;
    getContractFactory(
      name: "SimpleNFT",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.SimpleNFT__factory>;
    getContractFactory(
      name: "SimpleToken",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.SimpleToken__factory>;

    getContractAt(
      name: "ERC20",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.ERC20>;
    getContractAt(
      name: "IERC20Metadata",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IERC20Metadata>;
    getContractAt(
      name: "IERC20",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IERC20>;
    getContractAt(
      name: "ERC721",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.ERC721>;
    getContractAt(
      name: "IERC721Metadata",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IERC721Metadata>;
    getContractAt(
      name: "IERC721",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IERC721>;
    getContractAt(
      name: "IERC721Receiver",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IERC721Receiver>;
    getContractAt(
      name: "ERC165",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.ERC165>;
    getContractAt(
      name: "IERC165",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IERC165>;
    getContractAt(
      name: "IDeal",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IDeal>;
    getContractAt(
      name: "ILockableDeal",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.ILockableDeal>;
    getContractAt(
      name: "Deal",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.Deal>;
    getContractAt(
      name: "DealFactory",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.DealFactory>;
    getContractAt(
      name: "SimpleNFT",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.SimpleNFT>;
    getContractAt(
      name: "SimpleToken",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.SimpleToken>;

    // default types
    getContractFactory(
      name: string,
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<ethers.ContractFactory>;
    getContractFactory(
      abi: any[],
      bytecode: ethers.utils.BytesLike,
      signer?: ethers.Signer
    ): Promise<ethers.ContractFactory>;
    getContractAt(
      nameOrAbi: string | any[],
      address: string,
      signer?: ethers.Signer
    ): Promise<ethers.Contract>;
  }
}