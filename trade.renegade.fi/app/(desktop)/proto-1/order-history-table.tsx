import {
  Table,
  TableCaption,
  TableContainer,
  Tbody,
  Td,
  Tfoot,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react"

export const OrderHistoryTable = () => {
  return (
    <TableContainer>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Side</Th>
            <Th>Base</Th>
            <Th isNumeric>Amount</Th>
            <Th isNumeric>Filled Size</Th>
            <Th isNumeric>Order Value</Th>
            <Th>Status</Th>
            <Th>Order Id</Th>
            <Th>Created at</Th>
          </Tr>
        </Thead>
        <Tbody>
          <Tr>
            <Td>Buy</Td>
            <Td>WETH</Td>
            <Td isNumeric>0.001</Td>
            <Td isNumeric>0.001</Td>
            <Td isNumeric>0.001</Td>
            <Td>Pending</Td>
            <Td>0x123</Td>
            <Td>2024-05-09</Td>
          </Tr>
          <Tr>
            <Td>Sell</Td>
            <Td>WETH</Td>
            <Td isNumeric>0.001</Td>
            <Td isNumeric>0.001</Td>
            <Td isNumeric>0.001</Td>
            <Td>Pending</Td>
            <Td>0x123</Td>
            <Td>2024-05-09</Td>
          </Tr>
          <Tr>
            <Td>Buy</Td>
            <Td>WETH</Td>
            <Td isNumeric>0.001</Td>
            <Td isNumeric>0.001</Td>
            <Td isNumeric>0.001</Td>
            <Td>Pending</Td>
            <Td>0x123</Td>
            <Td>2024-05-09</Td>
          </Tr>
        </Tbody>
      </Table>
    </TableContainer>
  )
}
