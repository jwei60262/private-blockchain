/* ===== SHA256 with Crypto-js ===============================
|  Learn more: Crypto-js: https://github.com/brix/crypto-js  |
|  =========================================================*/
const SHA256 = require('crypto-js/sha256');

/* ===== Persist data with LevelDB ===================================
|  Learn more: level: https://github.com/Level/level     |
|  =============================================================*/

const level = require('level');
const chainDB = './chaindata';
const db = level(chainDB);

/* ===== Block Class ==============================
|  Class with a constructor for block 			   |
|  ===============================================*/

class Block {
  constructor(data) {
    this.hash = "",
      this.height = 0,
      this.body = data,
      this.time = 0,
      this.previousBlockHash = ""
  }
}

/* ===== Blockchain Class ==========================
|  Class with a constructor for new blockchain 		|
|  ================================================*/

class Blockchain {
  constructor() {
    this.getBlockHeight().then((height) => {
      if (height === -1) {
        this.addBlock(new Block("First block in the chain - Genesis block"));
      }
    })
  }

  // Add new block
  addBlock(newBlock) {
    this.getBlockHeight().then((height) => {
      newBlock.height = height + 1;
      newBlock.time = new Date().getTime().toString().slice(0, -3);

      if (newBlock.height === 0) {
        newBlock.hash = SHA256(JSON.stringify(newBlock)).toString();
        console.log('New block #' + newBlock.height);
        db.put(newBlock.height, JSON.stringify(newBlock).toString(), function (err) {
          if (err) return console.log('Block ' + newBlock.height + ' submission failed', err);
        })
      } else {
        this.getBlock(height).then((blockJson) => {
          console.log('Block ' + blockJson);
          let oldBlock = JSON.parse(blockJson);
          newBlock.previousBlockHash = oldBlock.hash;
          newBlock.hash = SHA256(JSON.stringify(newBlock)).toString();
          console.log('New block #' + newBlock.height);
          db.put(newBlock.height, JSON.stringify(newBlock).toString(), function (err) {
            if (err) return console.log('Block ' + newBlock.height + ' submission failed', err);
          })
        })
      }
    })
  }

  // Get block height
  getBlockHeight() {
    return new Promise(function (resolve, reject) {
      let height = 0;
      db.createReadStream()
        .on('data', function (data) {
          height++;
        })
        .on('error', function (err) {
          reject(err)
        })
        .on('close', function () {
          resolve(height - 1);
        });
    });
  }

  // get block
  getBlock(blockHeight) {
    return new Promise(function (resolve, reject) {
      db.get(blockHeight, function (err, value) {
        if (err) return console.log('Not found!', err);
        resolve(value);
      })
    });
  }

  // validate block
  validateBlock(blockHeight) {
    return this.getBlock(blockHeight).then((blockJson) => {
      let block = JSON.parse(blockJson);
      // get block hash
      let blockHash = block.hash;
      // remove block hash to test block integrity
      block.hash = '';
      // generate block hash
      let validBlockHash = SHA256(JSON.stringify(block)).toString();
      // Compare
      if (blockHash === validBlockHash) {
        return true;
      } else {
        console.log('Block #' + blockHeight + ' invalid hash:\n' + blockHash + '<>' + validBlockHash);
        return false;
      }
    })
  }

  // Validate blockchain
  validateChain() {
    this.getBlockHeight().then((height) => {
      let errorLog = [];
      for (var j = 0; j < height; j++) {
        // validate block
        let i = j;
        this.validateBlock(i).then((value) => {
          console.log(i + ' is validate? ' + value);
          if (!value) errorLog.push(i);
        })

        // compare blocks hash link
        this.getBlock(i).then((blockJson) => {
          let block = JSON.parse(blockJson);
          // get block hash
          let blockHash = block.hash;
          console.log('blockHash ' + blockHash);
          this.getBlock(i + 1).then((blockJson) => {
            let previousBlock = JSON.parse(blockJson);
            let previousHash = previousBlock.previousBlockHash;
            console.log('previousBlockHash ' + previousHash);
            if (blockHash !== previousHash) {
              errorLog.push(i);
            }
          })
        })
      }
      setTimeout(function () {
        if (errorLog.length > 0) {
          console.log('Block errors = ' + errorLog.length);
          console.log('Blocks: ' + errorLog);
        } else {
          console.log('No errors detected');
        }
      }, 100);
    })
  }
}