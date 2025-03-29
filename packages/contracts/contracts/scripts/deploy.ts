import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);
  console.log("Account balance:", (await deployer.getBalance()).toString());

  const PaymentToken = await ethers.getContractFactory("PaymentToken");
  const paymentToken = await PaymentToken.deploy(deployer.address);

  await paymentToken.waitForDeployment();

  const paymentTokenAddress = await paymentToken.getAddress();
  console.log("PaymentToken deployed to:", paymentTokenAddress);

  const InvoiceContract = await ethers.getContractFactory("InvoiceContract");
  const invoiceContract = await InvoiceContract.deploy(deployer.address, paymentTokenAddress);

  await invoiceContract.waitForDeployment();

  const invoiceContractAddress = await invoiceContract.getAddress();
  console.log("InvoiceContract deployed to:", invoiceContractAddress);

  // Opcional: Verificar el contrato en Etherscan
  // Descomentar si se desea verificar automáticamente
  /*
  if (network.name !== "hardhat" && network.name !== "localhost") {
    console.log("Waiting for block confirmations...");
    await paymentToken.deployTransaction.wait(5);
    await invoiceContract.deployTransaction.wait(5);

    console.log("Verifying contracts on Etherscan...");
    await run("verify:verify", {
      address: paymentTokenAddress,
      constructorArguments: [deployer.address],
    });

    await run("verify:verify", {
      address: invoiceContractAddress,
      constructorArguments: [deployer.address, paymentTokenAddress],
    });
  }
  */

  // Guardar las direcciones de los contratos desplegados para futura referencia
  const fs = require("fs");
  const contractAddresses = {
    PaymentToken: paymentTokenAddress,
    InvoiceContract: invoiceContractAddress,
  };

  fs.writeFileSync(
    "contract-addresses.json",
    JSON.stringify(contractAddresses, null, 2)
  );

  console.log("Contract addresses saved to contract-addresses.json");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
