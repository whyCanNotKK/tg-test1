import { Address, beginCell, Cell, Contract, contractAddress, ContractProvider, Sender, toNano } from '@ton/core';

export class Counter implements Contract {
    constructor(readonly address: Address, readonly init?: { code: Cell; data: Cell }) {}

    static create(initializeValue: number, code: Cell, workchain = 0) {
        const data = beginCell()
            .storeUint(initializeValue, 64)
            .endCell();
        const init = { code, data };
        const address = contractAddress(workchain, init);
        return new Counter(address, init);
    }

    async sendDeploy(provider: ContractProvider, via: Sender, value: number | string | bigint) {
        await provider.internal(via, {
            value: toNano(value),
            bounce: false
        });
    }

    async getCounter(provider: ContractProvider) {
        const {stack} = await provider.get("counter", []);
        return stack.readBigNumber();
    }

    async sendIncrement(provider: ContractProvider, via: Sender) {
        const messageBody = beginCell()
            .storeUint(1, 32)
            .storeUint(0, 64)
            .endCell();
        await provider.internal(via, {
            value: "0.002",
            body: messageBody
        });
    }
}