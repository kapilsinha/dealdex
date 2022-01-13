import {
    GridItem,
    VStack,
    HStack,
    Text,
    Button
  } from '@chakra-ui/react';

  import {MakeDealFormItem, MakeDealFormNumberItem} from './index'

function DealFormStep4(props) {

  const format = (val) => val;
  const parse = (val) => val.replace(/^\%/, '')
  const formatInput = (event) => {
      const attribute = event.target.getAttribute('name')
      this.setState({ [attribute]: event.target.value.trim() })
  }    


  const handleNextStep = () => {
    props.nextStep();
  };

  const handlePrevStep = () => {
    props.prevStep();
  };

    return (
      <GridItem colSpan={2} >
        <VStack w="65%" h="full" spacing={10} alignItems="flex-start">
            <VStack spacing={1} alignItems="flex-start">
                <Text variant="dealStepTitle">Fees</Text>
                <Text variant="dealStepDesc">Customize your optional syndication fee, payable in the project’s token. Syndication fees will be paid to you when the project deposits its tokens in the deal. Note that DealDex charges a 2.5% fee in the investors’ payment token when the project withdraws funds from the deal.</Text>
            </VStack>
        </VStack>
        <HStack w="65%" h="full" pt={5} spacing={10} alignItems="flex-start">
            <MakeDealFormItem 
                title="Syndicate wallet"
                colSpan={2}
                onChange={e => props.setDealData({ ...props.dealData, syndicate: e.target.value})}
                placeholder="Syndicate Wallet Address"
                value={props.dealData.syndicate}
                onBlur={e => formatInput(e)}
                isRequired= {false}
                helperText="This wallet will receive fees when the project’s tokens are deposited in the deal."
            />
        </HStack>
        <HStack w="65%" h="full" pt={5} spacing={10} alignItems="flex-start">
        <MakeDealFormNumberItem 
            title="Syndication Fee"
            colSpan={2}
            onChange = {value => props.setDealData({ ...props.dealData, syndicateFee: parse(value)})}
            placeholder = "0.0%"
            value = {props.dealData.syndicateFee ? props.dealData.syndicateFee : '0.0'}
            onBlur = {e => formatInput(e)}
            width="50%"
            maxvalue={100}
            parsing = {true}
            formatFuc = {format}
            parseFuc = {parse}
            appendChar = {"%"}
            helperText = ""
        />
        </HStack>
        <HStack w="full" h="full" pt={40} spacing={10} alignItems="flex-start">
        <Button variant="dealformBack" size="lg" onClick={handlePrevStep}>
          Back
        </Button>
        <Button variant="dealForm2Details" size="lg" onClick={handleNextStep}>
          Continue to review & submit
        </Button>
      </HStack>
      </GridItem>
    )
}

export default DealFormStep4;