"use client";
import classNames from "classnames";
import Image from "next/image";
import React, { useState } from "react";
import Icon from "app/components/assets/logos/Ascendre-icon_white.png";
import { FaSearch, FaUserAlt, FaUserFriends } from "react-icons/fa";
import { AuthButton } from "./Auth";
import { MdGroups, MdSpaceDashboard } from "react-icons/md";
import { useRouter } from "next/router";
const Sidebar = () => {
  const [toggleClass, setToggleClass] = useState(false);
  const wrapper = classNames(
    " h-full px-2 pt-6 pb-6 flex justify-between flex-col rounded  bg-neutral ",
    { ["w-48"]: !toggleClass, ["w-16"]: toggleClass }
  );
  return (
    <div className={wrapper}>
      <div className="felx flex-col">
        <div className="flex flex-col items-center justify-between relative">
          <div
            className="flex items-center pl-1 gap-2 select-none cursor-pointer"
            onClick={() => {
              setToggleClass(!toggleClass);
            }}
          >
            <Image
              src={Icon}
              alt="Ascendre"
              height={40}
              className={classNames({ hidden: !toggleClass })}
            />
            <span
              className={classNames(
                "mt-2 text-xl font-medium font-Croissant text-warning",
                {
                  hidden: toggleClass,
                }
              )}
            >
              Ascendre
            </span>
          </div>
          <div className="h-max pt-16   w-full flex flex-col ps-2 gap-6">
            <div className="cursor-pointer  group w-fit flex items-center justify-center py-1 px-2 gap-2 rounded-md">
              <MdSpaceDashboard className="text-3xl text-accent" />
              <span
                className={classNames(
                  " text-md font-semibold text-neutral-content",
                  {
                    hidden: toggleClass,
                  }
                )}
              >
                {`Dashboard`}
              </span>
            </div>
            <div className="cursor-pointer  group w-fit flex items-center justify-center py-1 px-2 gap-2 rounded-md">
              <MdGroups className="text-3xl text-accent" />
              <span
                className={classNames(
                  " text-md font-semibold text-neutral-content",
                  {
                    hidden: toggleClass,
                  }
                )}
              >
                {`Clubs`}
              </span>
            </div>
            <div className="cursor-pointer group w-fit flex items-center justify-center py-1 px-2 gap-2 rounded-md">
              <FaUserFriends className="text-3xl text-accent" />
              <span
                className={classNames(
                  " text-md font-semibold text-neutral-content",
                  {
                    hidden: toggleClass,
                  }
                )}
              >
                {`Friends`}
              </span>
            </div>
            <div className="cursor-pointer group w-fit flex items-center justify-center py-1 px-2 gap-2 rounded-md">
              <FaSearch className="text-xl text-accent" />
              <span
                className={classNames(
                  " text-md font-semibold text-neutral-content",
                  {
                    hidden: toggleClass,
                  }
                )}
              >
                {`Search`}
              </span>
            </div>
          </div>
        </div>
      </div>
      <hr className="mt-auto mb-2 border-2 border-primary-content rounded-lg" />
      <div className="cursor-pointer group w-fit flex items-center justify-center py-1 px-2 gap-2 rounded-md text-md font-semibold text-neutral-content">
        <FaUserAlt className="text-xl text-accent" />

        <AuthButton
          className={classNames({
            hidden: toggleClass,
          })}
        />
      </div>
    </div>
  );
};

export default Sidebar;
