## 项目要求

### Private Blockchain

Configure LevelDB to persist dataset

| 标准                                                         | 符合要求                                                     |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| Configure your application to use `levelDB` to persist blockchain dataset. | Depending on the Starter Code selected, includes the Node.js `level` library and configured to persist data within the project directory. |

Modify the App functions to persist data with LevelDB

| 标准                                                         | 符合要求                                                     |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| addBlock(newBlock) function includes a method to store newBlock with LevelDB. | addBlock(newBlock) includes a method to store newBlock within LevelDB |
| Genesis block persists as the first block in the blockchain using LevelDB with `height=0`. | Genesis block persist as the first block in the blockchain using LevelDB.Additionally, when adding a new block to the chain, code checks if a Genesis block already exists. If not, one is created before adding the a block. |

Modify "validation" functions

| 标准                                                         | 符合要求                                                     |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| Modify the `validateBlock()` function to validate a block stored within levelDB. | `validateBlock(height)` function to validate a block stored within levelDB. This function should get the `height` as a parameter and then retrieve the block and validate it. The validation should verify that the `hash` stored in the block is the same as the hash recalculated. |
| Modify the `validateChain()` function to validate blockchain stored within levelDB. | Implement the `validateChain()` function to validate blockchain stored within levelDB. You should retrieve the data and validate each block, also you need to validate that the `hash` of the block is equal to the next block `previousBlockHash` |

Modify getBlock() function

| 标准                                                         | 符合要求                                                     |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| Modify `getBlock(height)` function to retrieve a block by its block height within the LevelDB chain. | `getBlock(height)` function retrieves a block by block height within the LevelDB chain. |

Modify getBlockHeight() function

| 标准                                                         | 符合要求                                                     |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| Modify `getBlockHeight()` function to retrieve current block height within the LevelDB chain. | `getBlockHeight()` function retrieves current block height within the LevelDB chain. |


  