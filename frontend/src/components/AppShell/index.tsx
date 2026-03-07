import { type ReactNode, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import { RankBadge } from "@/components/RankBadge";
import { GlassButton } from "@/components/ui/GlassButton";
import { GlassSurface } from "@/components/ui/GlassSurface";
import { api, clearTokens } from "@/lib/api";
import {
  Body,
  Crumb,
  Left,
  MenuCard,
  MenuWrap,
  Right,
  ShellBody,
  ShellHead,
  UserControls,
  Wrap,
} from "./styles";

type AppShellProps = {
  title: string;
  context: string;
  children: ReactNode;
};

const AppShell = ({ title, context, children }: AppShellProps) => {
  const [email, setEmail] = useState<string>("trainer@21-counter");
  const [rank, setRank] = useState<string>("rookie");
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let active = true;
    api
      .me()
      .then((me) => {
        if (!active) return;
        setEmail(me.email);
        setRank(me.profile.rank);
      })
      .catch(() => {
        // Keep shell usable if profile request fails.
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    const onWindowClick = (event: MouseEvent) => {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };

    window.addEventListener("click", onWindowClick);
    return () => {
      window.removeEventListener("click", onWindowClick);
    };
  }, []);

  return (
    <Wrap>
      <ShellHead>
        <Left>
          <strong>21 Counter</strong>
          <span>{title}</span>
        </Left>
        <Crumb>{context}</Crumb>
        <Right>
          <UserControls>
            <RankBadge rank={rank} />
            <MenuWrap ref={menuRef}>
              <GlassButton
                $variant="secondary"
                aria-label="Open profile menu"
                onClick={() => setMenuOpen((open) => !open)}
              >
                {email}
              </GlassButton>
              {menuOpen ? (
                <GlassSurface as={MenuCard} $elevation={2}>
                  <GlassButton
                    $variant="destructive"
                    $full
                    onClick={() => {
                      clearTokens();
                      navigate("/auth");
                    }}
                  >
                    Logout
                  </GlassButton>
                </GlassSurface>
              ) : null}
            </MenuWrap>
          </UserControls>
        </Right>
      </ShellHead>
      <ShellBody>
        <Body>{children}</Body>
      </ShellBody>
    </Wrap>
  );
};

export { AppShell };
