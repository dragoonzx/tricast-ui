import React, { useEffect, useState } from "react";
import Slider from "react-input-slider";
import { useMoralis } from "react-moralis";
import TricastTrio from "../../abis/TricastTrio.json";
import { TRICAST_TRIO_CONTRACT } from "../../constants";
import Moralis from "moralis";

interface ITricastComponentProps {
  title?: string;
}

const TricastComponent = ({
  title = "Price of the AVAX will be above 100 at 21.02.2022, 18:00",
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
  };

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }

    getForBook();
    getAgainstBook();
  }, [isAuthenticated]);

  const [state, setState] = useState({ x: 10 });

  return (
    <div className="flex flex-col justify-between overflow-hidden text-left transition-shadow duration-200 bg-white rounded shadow-xl group hover:shadow-2xl">
      <div className="p-5">
        <p className="mb-2 font-bold text-xs">{title}</p>
        <div>
          <Slider
            axis="x"
            x={state.x}
            onChange={setState}
            styles={{
              active: {
                backgroundColor: "rgb(17 24 39)",
              },
            }}
          />
        </div>
        <div className="flex justify-between px-4 mt-2">
          <div className="flex flex-col text-center">
            <span className="text-xs">Limit (?)</span>
            <span className="text-2xl">
              {forBook ? 100 / forBook.bestBuyPrice : 0}x
            </span>
            <button>Yes</button>
          </div>
          <div className="flex flex-col text-center">
            <span className="text-xs">Limit (?)</span>
            <span className="text-2xl">
              {againstBook ? 100 / againstBook.bestBuyPrice : 0}x
            </span>
            <button>No</button>
          </div>
        </div>
      </div>
      <div className="w-full h-1 ml-auto duration-300 origin-left transform scale-x-0 bg-deep-purple-accent-400 group-hover:scale-x-100" />
    </div>
  );
};

export default TricastComponent;