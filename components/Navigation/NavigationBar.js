import Link from "next/link";
import { useState } from "react";
import styled from "styled-components";
import { signOut } from "next-auth/react";

export default function NavigationBar({className}) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  function handleLogOut() {
    signOut({ callbackUrl: "/auth/login" })
  }

  return (
    <Nav className={className}>
      <BurgerIcon onClick={toggleMenu}>
        <div className={`line ${isOpen ? "open" : ""}`}></div>
        <div className={`line ${isOpen ? "open" : ""}`}></div>
        <div className={`line ${isOpen ? "open" : ""}`}></div>
      </BurgerIcon>
      <NavList className={isOpen ? "open" : ""}>
        <li>
          <StyledLink href={"/"}>Home</StyledLink>
        </li>
        <li>
          <StyledButton href={"/yourgames"}>Deine Spiele</StyledButton>
        </li>
        <li>
          <StyledButton href={"/newgame"}>Neues Spiel erstellen</StyledButton>
        </li>
        <li>
          <StyledButton href={"/joingame"}>Spiel Beitreten</StyledButton>
        </li>
        <li>
          <StyledLogoutButton type="button" onClick={handleLogOut}>Logout</StyledLogoutButton>
        </li>
      </NavList>
    </Nav>
  );
}

const Nav = styled.nav`
  position: relative;
`;

const BurgerIcon = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  width: 30px;
  height: 25px;
  cursor: pointer;
  z-index: 10;
  
  .line {
    width: 30px;
    height: 4px;
    background-color: #333;
    transition: 0.3s;
  }

  .open:nth-child(1) {
    transform: rotate(45deg) translate(5px, 5px);
  }

  .open:nth-child(2) {
    opacity: 0;
  }

  .open:nth-child(3) {
    transform: rotate(-45deg) translate(7px, -7px);
  }
`;

const NavList = styled.ul`
  display: none;
  list-style: none;
  padding: 0;
  margin: 0;
  position: absolute;
  top: 60px;
  right: 20px;
  background-color: white;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  overflow: hidden;
  
  li {
    padding: 15px;
    text-align: left;


    


    &:hover {
      background-color: #f4f4f4;
    }
  }

    &:hover {
      background-color: #f4f4f4;
    }

  &.open {
    display: block;
  }
`;

const StyledLink = styled(Link)`
       background-color: transparent;
      border: none;
      text-decoration: none;
      color: #000000;
      font-size: 1.4rem;
      font-weight: bold;
      white-space: nowrap;
`;

const StyledButton = styled(Link)`
      background-color: transparent;
      border: none;
      text-decoration: none;
      color: #000000;
      font-size: 1.4rem;
      font-weight: bold;
      white-space: nowrap;
`;

const StyledLogoutButton = styled.button`
      background-color: transparent;
      border: none;
      text-decoration: none;
      color:rgb(82, 82, 82);
      font-size: 1.4rem;
      font-weight: bold;
      white-space: nowrap;

`;