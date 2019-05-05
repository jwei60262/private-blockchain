# Project Introduction

In this course, you learned all about blockchain and transaction data models as well as the differences between public and private blockchains. In this project you will put this knowledge to practice by creating your own private blockchain. However, this current model has some flaws in saving, persisting, and validating data. Your challenge in this project is to refactor your private blockchain to securely handle this information.

# Why this project?

This project introduces you to challenges faced when building out a blockchain storage method. So far, you’ve created a private blockchain that holds data in an array, but storing blockchain dataset in an array is not only expensive for computer memory but also inefficient for long term storage.

A core responsibilities of a blockchain nodes is to validate the blockchain dataset. Hence a more efficient key-value database Leveldb is ideal for such operations. *Infact, Bitcoin core uses Leveldb to store block index and UTXO set*

*In this project you will learn to validate the blockchain dataset by converting the current validation functions from storing data in a chain array to storing it in Leveldb and leveraging the persistence library LevelDB.*

By the end of the project, *you will have the skills needed to create your own private blockchain ledger that persists data and validates the blockchain ledger utilizing block hashes.*

# What will I learn

This project will allow you to build and expand upon the concepts and skills you’ve gained throughout this course. With this project you will:

- Differentiate Private Blockchain and Public Blockchain
- Identify what are the basic components in a Private Blockchain
- Define what is an application Model
- Implement basics functionalities for your Private Blockchain
- Implement a method to persist your Private Blockchain
- Implement with Node.js your application
- Test the application functionalities

# Build Your Project

For this project, you’ll need to validate the blockchain dataset by converting the current validation functions with chain array to LevelDB. In the project boilerplate, the array needs to be replaced with LevelDB to persist the data. Functions that once worked with the array should now work with LevelDB.

We’ve broken down the task into 3 steps which are further detailed throughout this project lesson.

## Step 1: Review Boilerplate Code

The provided boilerplate code contains two files - levelSandbox.js and simpleChain.js.

In this section, we will discuss the purpose of these two files and how to approach implementing the required functionalities to persist data and validate the blockchain ledger utilizing block hashes.

## Step 2: Modify Functions to Persist Data

The provided boilerplate code holds all data within the chain array. However, all the data in chain array is at risk of permanent loss when the chain array is refreshed. Hence, your main task is to modify the functions to properly persist the dataset.

The array needs to be replaced with LevelDB to persist the data. Functions that once worked with the array should now work with LevelDB.

| **Requirement 1** | Configure LevelDB to persist dataset                         |
| ----------------- | ------------------------------------------------------------ |
| **Requirement 2** | Modify simpleChain.js functions to persist data with LevelDB |
| **Requirement 3** | Modify getBlock() function                                   |
| **Requirement 4** | Modify getBlockHeight() function                             |
| **Requirement 5** | Modify validate functions                                    |

### Configure LevelDB to persist dataset

------

As discussed in Step 1, leveldbSandbox.js file already has project dependencies, storage location for dataset, and configured the db object to reference level with chainDB as the location of our dataset.

Make sure to configure simpleChain.js with levelDB to persist blockchain dataset using the level Node.js library.

The leveldbSandbox.js file already has a few basic functions implemented for you: addLevelDBData(key,value) addDataToLevelDB(value) getLevelDBData(key)

These functions are implemented using callbacks. You have to modify those methods using Promises.

#### Promises

The [Promise](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise) object represents the eventual completion (or failure) of an asynchronous operation along with its resulting value. Remember that you will need to`resolve` or `reject` depending on the results:

```
return new Promise(function(resolve, reject){  // code });
```

Below is an example where we are reading each data from the `db` object asynchronously and resolving when we have the complete array of elements.

```javascript
return new Promise(function(resolve, reject){
            self.db.createReadStream()
            .on('data', function (data) {
                dataArray.push(data);
            })
            .on('error', function (err) {
                reject(err)
            })
            .on('close', function () {
                resolve(dataArray);
            });
        });
```

### Modify simpleChain.js functions to persist data with LevelDB

------

#### addBlock(newBlock)

The main purpose of this function is to add a new block into the chain, to do that you need to assign the corresponding **height**, **hash**, **previousBlockHash** and **timeStamp** to your block.

Remember that the last thing you have to do is send this new block to the persistent method in your data access layer:

```
addDataToLevelDB(newBlock.height, JSON.stringify(newBlock).toString());
```

#### LevelDB Object Key

We recommend you to use the *block height* as the key for objects in LevelDB. This is because each block in the chain will have a unique (and predictable) height value.

#### Genesis Block

Make sure the genesis block persist as the first block in the blockchain using LevelDB.

Genesis Block should be added automatically when the chain is created.

Additionally, when adding a new block to the chain, code checks if a Genesis Block already exists. If not, one is created before adding a block.

### Modify getBlock() function

------

#### getBlock(blockHeight)

If you follow our recommendation to use the block **height** as a key this should be an easy one function to implement using:

```
db.get(key, function(err, value) {
            if (err) return console.log('Not found!', err);
            callback(value);
        });
```

or with Promises:

```
return new Promise((resolve, reject) => {
            db.get(key, function(err, value) {
                if (err) return console.log('Not found!', err);
                resolve(value);
            });
        })
```

### Modify getBlockHeight() function

------

#### getBlockHeight()

This function will allow you to count all the Blocks in your chain and give you as a result the last **height **in your chain, so if you need to create a new block you can get the the height and then say (given that you are using Promises):

```
getBlockHeight().then((height) => {
            newBlock.Height = height + 1;
        })
```

### Modify validate functions

------

#### validateBlock(blockHeight)

In the course, we have covered that one of the most important aspect of blockchain is data immutability. Hence in your private blockchain you need to make sure that no one has modified the content on one of the blocks.

How you can validate your block data integrity? Recall that you have the hash of each block. If any data in the block is changed, the newly generated hash would be different from the original one. That is the logic used in this method:

```
if(validBlockHash === blockHash) {
            resolve(true);
        } else {
            resolve(false);
        }
```

Remember, that to get the block hash, you need to first get the block from your chain using `getBlock(blockHeight)`.

validateChain()

This method is very important because it allows us to know if the entire chain is still valid at any moment or not. validateBlock() allows us to validate a single block but we need a different way to verify the integrity of the entire chain.

To validate the entire chain, we need to do 2 things:

- Validate each block in the chain
- Validate the links between blocks

We need go through all the blocks in the chain and verify the block integrity and also verify that the previousBlockHash in current block match with the hash in the previous block

#### Refactor with Promises

If you'd like to refactor this method to use Promises, this method fits nicely into that schema. Here's a hint:

```
Promise.all(promises).then((results) => { ... });
```

Using this you can validate for example all the blocks in the chain if you create a list of promises for that validation (this is only a recommendation, not required).

## Step 3: Test New Functionality

After modifying the methods and implementing LevelDB to persist blockchain’s data, you’ll need to test the functionality.

| **Requirement 1** | Create test blocks           |
| ----------------- | ---------------------------- |
| **Requirement 2** | Test the methods implemented |

#### Create test blocks

To create test blocks on your Private Blockchain, use this boilerplate function:

```javascript
(function theLoop (i) {
    setTimeout(function () {
        let blockTest = new Block.Block("Test Block - " + (i + 1));
        myBlockChain.addNewBlock(blockTest).then((result) => {
            console.log(result);
            i++;
            if (i < 10) theLoop(i);
        });
    }, 10000);
  })(0);
```

# Evaluation

Your project will be evaluated according to the Project Rubric(Reference to ProjectRubric.md). Be sure to review it thoroughly. All criteria must "meet specifications".