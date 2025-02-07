import { ScrollArea } from "@mantine/core";
import { NAVBAR_ITEMS } from "../../../constants/navbarItems";
import { LinksGroup } from "../NavbarLinksGroup/NavbarLinksGroup";
import { UserButton } from "../UserButton/UserButton";
import classes from "./NavbarNested.module.css";

export function NavbarNested() {
    const links = NAVBAR_ITEMS.map((item) => <LinksGroup {...item} key={item.label} />);

    return (
        <nav className={classes.navbar}>
            <ScrollArea className={classes.links}>
                <div className={classes.linksInner}>{links}</div>
            </ScrollArea>

            <div className={classes.footer}>
                <UserButton />
            </div>
        </nav>
    );
}
