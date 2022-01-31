import React, { useEffect, useState } from "react";
import Slider from "react-input-slider";
import { useMoralis } from "react-moralis";
import TricastTrio from "../../abis/TricastTrio.json";
import { TRICAST_TRIO_CONTRACT } from "../../constants";
import Moralis from "moralis";
import { ethers } from "ethers";

interface ITricastComponentProps {
  title?: string;
  market?: string;
}

const TricastComponent = ({
  title = "Price of the AVAX will be above 100 at 21.02.2022, 18:00",
  market,
}: ITricastComponentProps) => {
  const { isAuthenticated } = useMoralis();

  const [forBook, setForBook] = useState<any>();
  const [againstBook, setAgainstBook] = useState<any>();

  const getForBook = async () => {
    const options = {
      chain: "avalanche testnet" as "avalanche testnet",
      address: TRICAST_TRIO_CONTRACT,
      function_name: "forBook",
      abi: TricastTrio,
    };
    const forBook = await Moralis.Web3API.native.runContractFunction(options);
    console.log({ forBook });
    setForBook(forBook);
    // @ts-expect-error
    setYesX(forBook ? 100 / forBook.bestBuyPrice : 0);
  };

  const getAgainstBook = async () => {
    const options = {
      chain: "avalanche testnet" as "avalanche testnet",
      address: TRICAST_TRIO_CONTRACT,
      function_name: "againstBook",
      abi: TricastTrio,
    };
    const againstBook = await Moralis.Web3API.native.runContractFunction(
      options
    );
    console.log({ againstBook });
    setAgainstBook(againstBook);
    // @ts-expect-error
    setNoX(againstBook ? 100 / againstBook.bestBuyPrice : 0);
  };

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }

    getForBook();
    getAgainstBook();
  }, [isAuthenticated]);

  const [state, setState] = useState({ x: 10 });

  const [yesX, setYesX] = useState(0);
  const [noX, setNoX] = useState(0);

  useEffect(() => {
    setYesX(100 / state.x);
    setNoX(100 / (100 - state.x));
  }, [state]);

  const [val, setVal] = useState(0);

  const handleValChange = (e: React.SyntheticEvent) => {
    const newVal = (e.target as HTMLInputElement).value;
    const parsedVal = Number.parseFloat(newVal);
    setVal(parsedVal);
  };

  const forBuyLimit = async () => {
    // @ts-expect-error
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    const tricastContract = new ethers.Contract(
      TRICAST_TRIO_CONTRACT,
      TricastTrio,
      signer
    );

    const kek = await tricastContract.forBuyLimit(
      ethers.utils.parseUnits(String(val / state.x)),
      state.x
    );
  };

  const againstBuyLimit = async () => {
    // @ts-expect-error
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    const tricastContract = new ethers.Contract(
      TRICAST_TRIO_CONTRACT,
      TricastTrio,
      signer
    );

    const kek = await tricastContract.againstBuyLimit(
      ethers.utils.parseUnits(String(val)),
      100 - state.x
    );
  };

  return (
    <div className="flex flex-col justify-between overflow-hidden text-left transition-shadow duration-200 bg-white rounded shadow-xl group hover:shadow-2xl">
      <div className="p-5">
        <p className="mb-2 font-bold text-xs">{title}</p>
        <label>
          <input
            value={val}
            onChange={handleValChange}
            className="placeholder:text-slate-400 block bg-white w-full border border-slate-300 rounded-md py-2 pl-3 pr-3 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm"
            placeholder="10 AVAX"
            type="text"
            name="search"
          />
        </label>
        <div className="text-center mt-2">
          <Slider
            axis="x"
            x={state.x}
            onChange={setState}
            xmin={1}
            xstep={1}
            styles={{
              active: {
                backgroundColor: "rgb(17 24 39)",
              },
            }}
          />
        </div>
        <div className="flex justify-between px-4 mt-2">
          <div className="flex flex-col text-center">
            <span className="text-xs">Limit</span>
            <span className="text-2xl">{yesX.toFixed(1)} x</span>
            <button
              onClick={forBuyLimit}
              className="bg-gray-500 rounded text-white mt-2 w-20"
            >
              Yes
            </button>
          </div>
          <div className="flex flex-col text-center">
            <span className="text-xs">Limit</span>
            <span className="text-2xl">{noX.toFixed(1)} x</span>
            <button
              onClick={againstBuyLimit}
              className="bg-gray-500 rounded text-white mt-2 w-20"
            >
              No
            </button>
          </div>
        </div>
      </div>
      <div className="w-full h-1 ml-auto duration-300 origin-left transform scale-x-0 bg-deep-purple-accent-400 group-hover:scale-x-100" />
    </div>
  );
};

export default TricastComponent;
