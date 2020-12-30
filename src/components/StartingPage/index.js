// @flow

import React, { useState, useEffect } from "react"
import { makeStyles } from "@material-ui/core/styles"
import Grid from "@material-ui/core/Grid"
import { HeaderWithContainer } from "../Header"
import templates from "./templates"
import * as colors from "@material-ui/core/colors"
import { useDropzone } from "react-dropzone"
import CreateFromTemplateDialog from "../CreateFromTemplateDialog"
import AddAuthFromTemplateDialog from "../AddAuthFromTemplateDialog"
import { styled } from "@material-ui/core/styles"
import usePosthog from "../../hooks/use-posthog"
import packageInfo from "../../../package.json"
import useEventCallback from "use-event-callback"
import Box from "@material-ui/core/Box"
import Select from "react-select"
import { useTranslation } from "react-i18next"
import packageJSON from "../../../package.json"
import Button from "@material-ui/core/Button"
import RightSideContent from "./RightSideContent"
import {
  ContentContainer,
  Content,
  Title,
  Subtitle,
  ActionList,
  Action,
  ActionTitle,
  ActionText,
  Actionless,
  BottomSpacer,
  useStyles,
} from "./parts"

const languageSelectionFormStyle = {
  control: (base, state) => ({
    ...base,
    border: "1px solid #9e9e9e",
    background: "transparent",
    color: "#e0e0e0",
  }),
  menuList: (base) => ({
    ...base,
    padding: 0,
    margin: 0,
    color: "black",
  }),
  singleValue: (base) => ({
    ...base,
    color: "white",
  }),
}

const languageOptions = [
  { label: "English", value: "en" },
  { label: "French", value: "fr" },
  { label: "Chinese", value: "cn" },
  { label: "Portuguese", value: "pt" },
  { label: "Dutch", value: "nl" },
]

export default ({
  onFileDrop,
  onOpenTemplate,
  showDownloadLink = true,
  recentItems = [],
  onOpenRecentItem,
  onClickOpenSession,
}) => {
  const c = useStyles()
  const posthog = usePosthog()

  // internalization hook
  const { t, i18n } = useTranslation()

  const [
    createFromTemplateDialogOpen,
    changeCreateFromTemplateDialogOpen,
  ] = useState(false)
  const [addAuthFromDialogOpen, changeAddAuthFromDialogOpen] = useState(false)
  const onDrop = useEventCallback((acceptedFiles) => {
    onFileDrop(acceptedFiles[0])
  })

  const changeLanguage = (language) => {
    i18n.changeLanguage(language)
  }

  let { getRootProps, getInputProps } = useDropzone({ onDrop })

  return (
    <div className={c.container}>
      <HeaderWithContainer>
        <ContentContainer>
          <Content>
            <Grid container>
              <Grid xs={12} sm={6} item>
                <Title>Universal Data Tool</Title>
                <Subtitle>{t("universaldatatool-description")}</Subtitle>
                <Subtitle>v{packageJSON.version}</Subtitle>
              </Grid>
              <Grid xs={12} sm={6} item>
                <Box className={c.languageSelectionBox}>
                  <Box
                    width="100%"
                    maxWidth={200}
                    className={c.languageSelectionWrapper}
                  >
                    <Select
                      id="language-list"
                      styles={languageSelectionFormStyle}
                      defaultValue={languageOptions.filter(
                        (lang) => lang.value === i18n.language
                      )}
                      options={languageOptions}
                      onChange={({ value }) => changeLanguage(value)}
                    />
                  </Box>
                </Box>
              </Grid>
              <Grid xs={12} sm={6} item>
                <ActionList>
                  <ActionTitle>{t("start")}</ActionTitle>
                  <Action
                    onClick={() => {
                      posthog.capture("template_clicked", {
                        clicked_template: "empty",
                      })
                      onOpenTemplate(templates.find((t) => t.name === "Empty"))
                    }}
                  >
                    {t("new-file")}
                  </Action>
                  <Action
                    onClick={() => changeCreateFromTemplateDialogOpen(true)}
                  >
                    {t("start-from-template")}
                  </Action>
                  <Action {...getRootProps()}>
                    <input {...getInputProps()} />
                    {t("open-file")}
                  </Action>
                  {onClickOpenSession && (
                    <Action onClick={onClickOpenSession}>
                      {t("open-collaborative-session")}
                    </Action>
                  )}
                  <Action onClick={() => changeAddAuthFromDialogOpen(true)}>
                    {t("add-authentication")}
                  </Action>
                  <Action
                    onClick={() => {
                      window.location.href =
                        "https://universaldatatool.com/courses"
                    }}
                  >
                    {t("create-training-course")}
                  </Action>
                  {/* <Action>Open Folder</Action> */}
                </ActionList>
                <ActionList>
                  <ActionTitle>{t("recent")}</ActionTitle>
                  {recentItems.length === 0 ? (
                    <Actionless>{t("no-recent-files")}</Actionless>
                  ) : (
                    recentItems.map((ri, i) => (
                      <Action key={i} onClick={() => onOpenRecentItem(ri)}>
                        {ri.fileName}
                      </Action>
                    ))
                  )}
                </ActionList>
                <ActionList>
                  <ActionTitle>{t("help")}</ActionTitle>
                  <Action href="https://github.com/UniversalDataTool/universal-data-tool/releases">
                    {t("downloading-and-installing-udt")}
                  </Action>
                  <Action href="https://dev.to/seveibar/make-bounding-boxes-for-artificial-intelligence-with-udt-1kai">
                    {t("labeling-images")}
                  </Action>
                  {/* <Action>Custom Data Entry</Action> */}
                  <Action href="https://github.com/UniversalDataTool/universal-data-tool">
                    {t("github-repository")}
                  </Action>
                  <Action href="https://www.youtube.com/channel/UCgFkrRN7CLt7_iTa2WDjf2g">
                    {t("youtube-channel")}
                  </Action>

                  {/* <Action href="#">
                  How to Collaborate in Real-Time with UDT
                </Action> */}
                </ActionList>
              </Grid>
              <Grid xs={12} sm={6} item>
                <RightSideContent />
              </Grid>
              <Grid xs={12} sm={6} item>
                <BottomSpacer />
              </Grid>
            </Grid>
          </Content>
        </ContentContainer>
      </HeaderWithContainer>
      <CreateFromTemplateDialog
        open={createFromTemplateDialogOpen}
        onSelect={(template) => {
          posthog.capture("template_clicked", {
            clicked_template: template.name,
          })
          onOpenTemplate(template)
        }}
        onClose={() => changeCreateFromTemplateDialogOpen(false)}
      />
      <AddAuthFromTemplateDialog
        open={addAuthFromDialogOpen}
        onSelect={(template) => onOpenTemplate(template)}
        onClose={() => changeAddAuthFromDialogOpen(false)}
      />
    </div>
  )
}
