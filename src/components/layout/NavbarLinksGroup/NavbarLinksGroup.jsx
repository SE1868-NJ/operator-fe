import { Box, Collapse, Group, Text, ThemeIcon, UnstyledButton } from "@mantine/core";
import { IconChevronRight } from "@tabler/icons-react";
import PropTypes from "prop-types";
import { useState } from "react";
import { Link } from "react-router-dom";
import classes from "./NavbarLinksGroup.module.css";

export function LinksGroup({ icon: Icon, label, initiallyOpened, links, link }) {
    const hasLinks = Array.isArray(links);
    const [opened, setOpened] = useState(initiallyOpened || false);
    const items = (hasLinks ? links : []).map((link) => (
        <Text component={Link} className={classes.link} to={link.link} key={link.label}>
            {link.label}
        </Text>
    ));

    return (
        <>
            <UnstyledButton
                onClick={() => {
                    if (!link) {
                        setOpened((o) => !o);
                    }
                }}
                className={classes.control}
                {...(link ? { component: Link, to: link } : {})}
            >
                <Group justify="space-between" gap={0}>
                    <Box style={{ display: "flex", alignItems: "center" }}>
                        <ThemeIcon variant="light" size={30}>
                            <Icon size={18} />
                        </ThemeIcon>
                        <Box ml="md">{label}</Box>
                    </Box>
                    {hasLinks && (
                        <IconChevronRight
                            className={classes.chevron}
                            stroke={1.5}
                            size={16}
                            style={{ transform: opened ? "rotate(-90deg)" : "none" }}
                        />
                    )}
                </Group>
            </UnstyledButton>
            {hasLinks ? <Collapse in={opened}>{items}</Collapse> : null}
        </>
    );
}
// PropTypes Validation
LinksGroup.propTypes = {
    icon: PropTypes.elementType.isRequired,
    label: PropTypes.string.isRequired,
    initiallyOpened: PropTypes.bool,
    links: PropTypes.arrayOf(
        PropTypes.shape({
            label: PropTypes.string.isRequired,
            link: PropTypes.string.isRequired,
        }),
    ),
    link: PropTypes.string,
};
