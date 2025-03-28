import styled from "styled-components";
import { BsBoxSeam } from "react-icons/bs";
import { GrConfigure } from "react-icons/gr";
import { LuConciergeBell } from "react-icons/lu";
import { RiMoneyDollarCircleLine } from "react-icons/ri";
import { SiWebmoney } from "react-icons/si";
import { GoHome } from "react-icons/go";
import { RxDashboard } from "react-icons/rx";
import { FaRegCircle } from "react-icons/fa";

export const Logo = styled(SiWebmoney)`
    width: 35px;
    height: 35px;
    margin: auto;
`;

export const Home = styled(GoHome)`
    width: 20px;
    height: 20px;
    margin: auto 3px auto 0;
`;

export const Panel = styled(RxDashboard)`
    width: 19px;
    height: 19px;
    margin: auto 3px auto 0;
`;

export const Coin = styled(RiMoneyDollarCircleLine)`
    width: 19px;
    height: 19px;
    margin: auto 2px auto 0;
`;

export const Bell = styled(LuConciergeBell)`
    width: 18px;
    height: 18px;
    margin: auto 3px auto 0;
`;

export const Box = styled(BsBoxSeam )`
    width: 16px;
    height: 16px;
    margin: auto 6px auto 0;
`;

export const Config = styled(GrConfigure)`
    width: 16px;
    height: 16px;
    margin: auto 5px auto 0;
`;

export const Circle = styled(FaRegCircle)`
    width: 8px;
    height: 8px;
    margin: auto 5px auto 0;
`;
