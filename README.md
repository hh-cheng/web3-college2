# **Web3 大学平台技术方案**

# **一、整体架构概览**

**角色与对象**

- **学生用户**
- **课程作者（讲师）**
- **平台（Owner / Multisig）**

**核心对象**

- **YD Token（平台代币）**
- **Course（课程）**
- **Course Purchase（购买记录）**
- **讲师收益与资金流（YD → ETH → USDT → AAVE）**

**推荐技术栈**

- **区块链：** Ethereum（开发使用 Sepolia）
- **合约语言：** Solidity 0.8.x，OpenZeppelin
- **前端：** Next.js（App Router）、zustand、viem、MetaMask（EIP-1193）
- **数据层：** The Graph（记录购买记录、销量等）



# **二、智能合约设计**

## **2.1 YD Token 合约**

平台自定义代币，用于课程购买与讲师提现。

- 标准：ERC20 + Ownable
- 符号：YD
- 精度：0
- Mint 权限：平台作为 Owner 控制

合约名称：YDToken

是否开放增发：推荐由平台 Owner 控制是否增发（通过 mint）。



## **2.2 CourseManager 课程管理合约**

负责：

- 创建课程
- 价格管理
- 用户购买（approve → purchase）
- 讲师收益累计与提现
- 查询用户购买记录



### **2.2.1 数据结构**

```solidity
struct Course {
    uint256 id;
    address author;
    uint256 price;        // 以 YD 计价
    string  metadataUri;  // 存课程元数据
    bool    active;
}

mapping(uint256 => Course) public courses;
uint256 public nextCourseId;

mapping(address => mapping(uint256 => bool)) public hasPurchased;
mapping(address => uint256[]) public userPurchasedCourses;

mapping(uint256 => uint256) public courseBalance;
mapping(address => uint256) public authorBalance;

IERC20 public ydToken;
```



### **2.2.2 创建课程**

```solidity
function createCourse(
    uint256 priceInYD,
    string calldata metadataUri
) external returns (uint256 courseId);
```

- 调用者即课程作者
- 自动分配 courseId
- 创建后不可删除，但可下架



### **2.2.3 修改课程价格 / 上架 / 下架**

```solidity
function updateCoursePrice(uint256 courseId, uint256 newPrice) external;
function setCourseActive(uint256 courseId, bool isActive) external;
```

权限：仅课程作者（或管理员）可调用。



### **2.2.4 购买课程（包含 approve + purchase 流程）**

**流程：**

1. 用户先执行：

```
YDToken.approve(courseManagerAddress, price)
```

2. 前端再调用：

```solidity
function purchase(uint256 courseId) external;
```

内部逻辑：

```solidity
ydToken.transferFrom(msg.sender, address(this), c.price);
hasPurchased[msg.sender][courseId] = true;
userPurchasedCourses[msg.sender].push(courseId);
courseBalance[courseId] += c.price;
authorBalance[c.author] += c.price;
```

会触发事件：

```solidity
event CoursePurchased(address user, uint256 courseId, uint256 price);
```



### **2.2.5 讲师提现 YD**

讲师将课程收入提现为 YD：

```solidity
function withdrawYD(uint256 amount) external;
```

提现之后可以在前端执行：

- YD → ETH（DEX Swap）

- ETH → USDT（DEX Swap）

- USDT → AAVE Pool Deposit

  文档：https://aave.com/docs/resources/addresses

> 注：v0.1 中不实现链上一键理财 Router，留作 v1.0 版本增强。



# **三、个人中心相关逻辑**

## **3.1 购买记录查询**

链上查询：

```solidity
function getUserPurchasedCourses(address user) external view returns (uint256[]);
function hasUserPurchased(address user, uint256 courseId) external view returns (bool);
function getCourse(uint256 courseId) external view returns (Course memory);
```



## **3.2 用户名修改（MetaMask 签名 Off-chain）**

昵称不需要上链，通过签名验证权限：

**流程**

1. 前端输入新昵称 newName

2. 后端生成 message：
   ```postgresql
   web3-university profile update
   address=${userAddress}
   newName=${newName}
   timestamp=${...}
   ```

3. 前端调用：
   ```ts
   const signature = signMessage({ message })
   ```

4. 后端使用 verifyMessage 验证签名
5. 写入数据库更新昵称

**技术点**

- 前端：自定义钱包 → signMessage() / signTypedData()
- 后端：Next.js Server Actions → viem/ethers 验证签名
- DB：Postgres



# **四、前端交互设计**

## **4.1 连接钱包**

使用自定义钱包 **TODO**



## **4.2 购买流程（approve + purchase）**

1. 获取用户 allowance：
   ```solidity
   readContract({ functionName: "allowance", args: [user, courseManager] })
   ```

2. 若不足，执行：
   ```solidity
   writeContract({ functionName: "approve", args: [courseManager, price] })
   ```

3. 完成批准后执行：
   ```solidity
   writeContract({ functionName: "purchase", args: [courseId] })
   ```



## **4.3 页面结构**

- /：课程列表
- /course/[id]：课程详情（购买流程）
- /author/create：创建课程
- /me：个人中心（MetaMask 签名修改昵称 + 已购课程）
- /learn/[courseId]：课程学习页



# **五、安全性设计**

- YD Token：
  - mint 权限由平台控制
  - 部署后可选择放入 multisig
- CourseManager：
  - 课程修改仅限作者
  - 购买需依赖用户主动 approve，安全可靠
  - 提款由作者自身地址执行
- Off-chain 签名：
  - 后端必须验证签名
  - 防重放：签名 message 添加 timestamp 或 nonce



# **六、版本规划**

## **v0.1（当前版本）**

- YD Token（ERC20）
- CourseManager（课程创建 / 购买 / 提现）
- 基础前端（课程列表、详情、购买）
- 用户个人中心（昵称修改 + 购买历史）
- 可选：The Graph 子图（展示销量、购买记录）

## **v1.0（升级版本）**

- YieldManager 合约

  （YD → ETH → USDT → AAVE 一键理财）

- 完整 DEX 路由集成（Uniswap V3）

- AAVE v4 supply/withdraw 全链上实现

- 多链扩展（L2 + Gas 优化）

- 平台管理后台（运营报表）
