/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import type { DealFactory, DealFactoryInterface } from "../DealFactory";

const _abi = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "creator",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "project",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "dealAddress",
        type: "address",
      },
    ],
    name: "DealCreated",
    type: "event",
  },
  {
    inputs: [
      {
        components: [
          {
            components: [
              {
                internalType: "address",
                name: "dealdex",
                type: "address",
              },
              {
                internalType: "address",
                name: "manager",
                type: "address",
              },
              {
                internalType: "address",
                name: "project",
                type: "address",
              },
            ],
            internalType: "struct ParticipantAddresses",
            name: "participantAddresses",
            type: "tuple",
          },
          {
            components: [
              {
                internalType: "uint256",
                name: "numerator",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "denominator",
                type: "uint256",
              },
            ],
            internalType: "struct ExchangeRate",
            name: "exchangeRate",
            type: "tuple",
          },
          {
            components: [
              {
                components: [
                  {
                    internalType: "uint256",
                    name: "minInvestmentPerInvestor",
                    type: "uint256",
                  },
                  {
                    internalType: "uint256",
                    name: "maxInvestmentPerInvestor",
                    type: "uint256",
                  },
                  {
                    internalType: "uint256",
                    name: "minTotalInvestment",
                    type: "uint256",
                  },
                  {
                    internalType: "uint256",
                    name: "maxTotalInvestment",
                    type: "uint256",
                  },
                ],
                internalType: "struct InvestmentSizeConstraints",
                name: "sizeConstraints",
                type: "tuple",
              },
              {
                internalType: "enum LockedDealConstraint",
                name: "lockConstraint",
                type: "uint8",
              },
              {
                internalType: "address",
                name: "investmentTokenAddress",
                type: "address",
              },
              {
                internalType: "address",
                name: "gateToken",
                type: "address",
              },
              {
                internalType: "enum InvestmentKeyType",
                name: "investmentKeyType",
                type: "uint8",
              },
              {
                internalType: "uint256",
                name: "investmentDeadline",
                type: "uint256",
              },
            ],
            internalType: "struct InvestConfig",
            name: "investConfig",
            type: "tuple",
          },
          {
            components: [
              {
                internalType: "bool",
                name: "allowRefunds",
                type: "bool",
              },
              {
                internalType: "enum LockedDealConstraint",
                name: "lockConstraint",
                type: "uint8",
              },
            ],
            internalType: "struct ClaimRefundConfig",
            name: "refundConfig",
            type: "tuple",
          },
          {
            components: [
              {
                internalType: "address",
                name: "projectTokenAddress",
                type: "address",
              },
              {
                internalType: "uint16",
                name: "dealdexFeeBps",
                type: "uint16",
              },
              {
                internalType: "uint16",
                name: "managerFeeBps",
                type: "uint16",
              },
              {
                internalType: "enum LockedDealConstraint",
                name: "lockConstraint",
                type: "uint8",
              },
            ],
            internalType: "struct ClaimTokensConfig",
            name: "tokensConfig",
            type: "tuple",
          },
          {
            components: [
              {
                internalType: "uint16",
                name: "dealdexFeeBps",
                type: "uint16",
              },
              {
                internalType: "uint16",
                name: "managerFeeBps",
                type: "uint16",
              },
              {
                internalType: "enum LockedDealConstraint",
                name: "lockConstraint",
                type: "uint8",
              },
            ],
            internalType: "struct ClaimFundsConfig",
            name: "fundsConfig",
            type: "tuple",
          },
          {
            components: [
              {
                internalType: "enum VestingStrategy",
                name: "vestingStrategy",
                type: "uint8",
              },
              {
                internalType: "uint16[]",
                name: "vestingBps",
                type: "uint16[]",
              },
              {
                internalType: "uint256[]",
                name: "vestingTimestamps",
                type: "uint256[]",
              },
            ],
            internalType: "struct VestingSchedule",
            name: "vestingSchedule",
            type: "tuple",
          },
        ],
        internalType: "struct DealConfig",
        name: "_dealConfig",
        type: "tuple",
      },
    ],
    name: "createDeal",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "dealContractAddress",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "dealdexAddress",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_dealContractAddress",
        type: "address",
      },
      {
        internalType: "address",
        name: "_dealdexAddress",
        type: "address",
      },
    ],
    name: "initialize",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const _bytecode =
  "0x608060405234801561001057600080fd5b50610bdc806100206000396000f3fe608060405234801561001057600080fd5b506004361061004c5760003560e01c8063485cc9551461005157806383c784ca14610066578063937d50b51461009b578063dbcdd9d7146100ae575b600080fd5b61006461005f3660046106be565b6100c1565b005b60005461007f906201000090046001600160a01b031681565b6040516001600160a01b03909116815260200160405180910390f35b60015461007f906001600160a01b031681565b6100646100bc3660046106f0565b6101c1565b600054610100900460ff166100dc5760005460ff16156100e0565b303b155b6101475760405162461bcd60e51b815260206004820152602e60248201527f496e697469616c697a61626c653a20636f6e747261637420697320616c72656160448201526d191e481a5b9a5d1a585b1a5e995960921b606482015260840160405180910390fd5b600054610100900460ff16158015610169576000805461ffff19166101011790555b6000805462010000600160b01b031916620100006001600160a01b038681169190910291909117909155600180546001600160a01b03191691841691909117905580156101bc576000805461ff00191690555b505050565b60015481516001600160a01b03918216905260808201516000602090910181905260a083015160fa90819052815491929091839161020591620100009004166102b6565b604051632a1a750b60e21b81529091506001600160a01b0382169063a869d42c90610234908790600401610999565b600060405180830381600087803b15801561024e57600080fd5b505af1158015610262573d6000803e3d6000fd5b5050855160409081015190516001600160a01b03858116825290911692503391507f36bb40958b69ee7898a72c66451d3cd29a974199ddd161bfd49ee8e0bfdc8c9a9060200160405180910390a350505050565b6000808260601b9050604051733d602d80600a3d3981f3363d3d373d3d3d363d7360601b81528160148201526e5af43d82803e903d91602b57fd5bf360881b60288201526037816000f0949350505050565b80356001600160a01b038116811461031f57600080fd5b919050565b600082601f830112610334578081fd5b8135602061034961034483610b36565b610b05565b80838252828201915082860187848660051b8901011115610368578586fd5b855b858110156103865781358452928401929084019060010161036a565b5090979650505050505050565b80356002811061031f57600080fd5b803561031f81610b99565b6000606082840312156103be578081fd5b6103c6610a50565b90506103d1826106ac565b81526103df602083016106ac565b602082015260408201356103f281610b99565b604082015292915050565b60006040828403121561040e578081fd5b610416610a79565b90508135801515811461042857600080fd5b8152602082013561043881610b99565b602082015292915050565b600060808284031215610454578081fd5b61045c610a9c565b905061046782610308565b8152610475602083016106ac565b6020820152610486604083016106ac565b6040820152606082013561049981610b99565b606082015292915050565b6000604082840312156104b5578081fd5b6104bd610a79565b9050813581526020820135602082015292915050565b60008183036101208112156104e6578182fd5b6104ee610abf565b915060808112156104fe57600080fd5b50610507610a9c565b8235815260208301356020820152604083013560408201526060830135606082015280825250610539608083016103a2565b602082015261054a60a08301610308565b604082015261055b60c08301610308565b606082015261056c60e08301610393565b608082015261010082013560a082015292915050565b600060608284031215610593578081fd5b61059b610a50565b90506105a682610308565b81526105b460208301610308565b60208201526103f260408301610308565b6000606082840312156105d6578081fd5b6105de610a50565b905081356105eb81610b99565b815260208281013567ffffffffffffffff8082111561060957600080fd5b818501915085601f83011261061d57600080fd5b813561062b61034482610b36565b80828252858201915085850189878560051b880101111561064b57600080fd5b600095505b8386101561067557610661816106ac565b835260019590950194918601918601610650565b508086880152505050604085013592508083111561069257600080fd5b50506106a084828501610324565b60408301525092915050565b803561ffff8116811461031f57600080fd5b600080604083850312156106d0578182fd5b6106d983610308565b91506106e760208401610308565b90509250929050565b600060208284031215610701578081fd5b813567ffffffffffffffff80821115610718578283fd5b90830190610300828603121561072c578283fd5b610734610ae2565b61073e8684610582565b815261074d86606085016104a4565b602082015261075f8660a085016104d3565b6040820152610772866101c085016103fd565b6060820152610785866102008501610443565b60808201526107988661028085016103ad565b60a08201526102e0830135828111156107af578485fd5b6107bb878286016105c5565b60c08301525095945050505050565b600281106107da576107da610b5a565b9052565b61ffff80825116835280602083015116602084015250604081015161080281610b86565b806040840152505050565b805115158252602081015161082181610b86565b806020840152505050565b60018060a01b038151168252602081015161ffff80821660208501528060408401511660408501525050606081015161086481610b86565b806060840152505050565b8051805183526020810151602084015260408101516040840152606081015160608401525060208101516108a281610b86565b608083015260408101516001600160a01b031660a083015260608101516108d460c08401826001600160a01b03169052565b5060808101516108e760e08401826107ca565b5060a001516101009190910152565b600060608301825161090781610b86565b8452602083810151606082870152805192839052810191839060808701905b8083101561094a57845161ffff168252938301936001929092019190830190610926565b506040868101518883039189019190915280518083529084019450908301915084905b8082101561098d578451835293830193918301916001919091019061096d565b50909695505050505050565b6020808252825180516001600160a01b03908116848401528183015181166040808601919091529182015116606084015283820151805160808501529091015160a08301528201516000906109f160c084018261086f565b506060830151610a056101e084018261080d565b506080830151610a1961022084018261082c565b5060a0830151610a2d6102a08401826107de565b5060c083015161030083810152610a486103208401826108f6565b949350505050565b6040516060810167ffffffffffffffff81118282101715610a7357610a73610b70565b60405290565b6040805190810167ffffffffffffffff81118282101715610a7357610a73610b70565b6040516080810167ffffffffffffffff81118282101715610a7357610a73610b70565b60405160c0810167ffffffffffffffff81118282101715610a7357610a73610b70565b60405160e0810167ffffffffffffffff81118282101715610a7357610a73610b70565b604051601f8201601f1916810167ffffffffffffffff81118282101715610b2e57610b2e610b70565b604052919050565b600067ffffffffffffffff821115610b5057610b50610b70565b5060051b60200190565b634e487b7160e01b600052602160045260246000fd5b634e487b7160e01b600052604160045260246000fd5b60038110610b9657610b96610b5a565b50565b60038110610b9657600080fdfea2646970667358221220c25575bfdec51c66ef3a4c2ecc1822db85b70856e67ec2f052508ffd0bec8af164736f6c63430008040033";

type DealFactoryConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: DealFactoryConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class DealFactory__factory extends ContractFactory {
  constructor(...args: DealFactoryConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
    this.contractName = "DealFactory";
  }

  deploy(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<DealFactory> {
    return super.deploy(overrides || {}) as Promise<DealFactory>;
  }
  getDeployTransaction(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  attach(address: string): DealFactory {
    return super.attach(address) as DealFactory;
  }
  connect(signer: Signer): DealFactory__factory {
    return super.connect(signer) as DealFactory__factory;
  }
  static readonly contractName: "DealFactory";
  public readonly contractName: "DealFactory";
  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): DealFactoryInterface {
    return new utils.Interface(_abi) as DealFactoryInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): DealFactory {
    return new Contract(address, _abi, signerOrProvider) as DealFactory;
  }
}