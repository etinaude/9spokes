/**
 * @fileoverview controls the UI of the addin.
 * @package
 * @class AppProps
 * @class AppState
 * @class App
 */

import * as React from "react";
import { Button, ButtonType, Overlay, Spinner, SpinnerSize, MessageBar, MessageBarType } from "office-ui-fabric-react";
import { Pivot, PivotItem, PivotLinkFormat } from "office-ui-fabric-react/lib/Pivot";
import Header from "./Header";
import HeroList, { HeroListItem } from "./HeroList";
import { SearchBox, ISearchBoxStyles } from "office-ui-fabric-react/lib/SearchBox";
import { Stack, IStackTokens } from "office-ui-fabric-react/lib/Stack";
import Title from "./Title";
import Progress from "./Progress";
import { Card, ICardTokens, ICardSectionStyles, ICardSectionTokens } from "@uifabric/react-cards";
import { FontWeights } from "@uifabric/styling";
import { Text, ITextStyles } from "office-ui-fabric-react";
import {
  populateHouse,
  populateLinkedIn,
  populateFinance,
  populateTrends
  /*
      populateFacebook,
      populateXero
    */
} from "../sheets/population";
import { searchHouse, searchFinance } from "../sheets/api";
import { loadConfig, saveConfig } from "../sheets/config";

//import { SourceMapDevToolPlugin } from "webpack";
/* global Button, console, Excel, Header, HeroList, HeroListItem, Progress */

// const alertClicked = (data: string): void => {
//   console.log(data + " is Clicked");
// };

export interface AppProps {
  title: string;
  isOfficeInitialized: boolean;
}

export interface AppState {
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  listItems: HeroListItem[];
  showHouseResults: boolean;
  showTrendsResults: boolean;
  showFinanceResults: boolean;
  showLinkedinResults: boolean;
  companiesHouseName: string;
  googleTrendsName: string;
  yahooFinanceName: string;
  linkedinName: string;
  companiesHouseList: any;
  googleTrendsList: any;
  yahooFinanceList: any;
  linkedInList: any;
}

const LoadingOverlay = () => (
  <Overlay isDarkThemed={true}>
    <div className="center vertical">
      <Spinner size={SpinnerSize.large} />
    </div>
  </Overlay>
);

export default class App extends React.Component<AppProps, AppState> {
  constructor(props, context) {
    super(props, context);
    this.state = {
      isLoading: false,
      isSuccess: false,
      isError: false,
      listItems: [],
      showHouseResults: false,
      showTrendsResults: false,
      showFinanceResults: false,
      showLinkedinResults: false,
      companiesHouseName: "",
      googleTrendsName: "",
      yahooFinanceName: "",
      linkedinName: "",
      companiesHouseList: [],
      googleTrendsList: [],
      yahooFinanceList: [],
      linkedInList: []
    };
  }

  SuccessNotify = () => (
    <MessageBar
      messageBarType={MessageBarType.success}
      isMultiline={false}
      onDismiss={() => this.setState({ isSuccess: false })}
      dismissButtonAriaLabel="Close"
    >
      Success
    </MessageBar>
  );

  ErrorNotify = () => (
    <MessageBar
      messageBarType={MessageBarType.error}
      isMultiline={false}
      onDismiss={() => this.setState({ isError: false })}
      dismissButtonAriaLabel="Close"
    >
      Error
    </MessageBar>
  );

  _showHouseResults = async (bool, val) => {
    this.setState({
      isLoading: true,
      showHouseResults: bool,
      companiesHouseName: val
    });

    this.setState({
      companiesHouseList: (await searchHouse(val)).results,
      isLoading: false
    });
  };

  _showTrendsResults = async (bool, val) => {
    this.setState({
      showTrendsResults: bool,
      googleTrendsName: val
    });

    // this.setState({ googleTrendsList: await ___) });
  };

  _showFinanceResults = async (bool, val) => {
    this.setState({
      isLoading: true,
      showFinanceResults: bool,
      yahooFinanceName: val
    });

    this.setState({
      yahooFinanceList: (await searchFinance(val)).results,
      isLoading: false
    });
  };

  _showLinkedinResults = async (bool, val) => {
    this.setState({
      showLinkedinResults: bool,
      linkedinName: val
    });

    // this.setState({ linkedInList: await ___ });
  };

  componentDidMount() {
    this.setState({
      listItems: [
        {
          icon: "Home",
          primaryText: 'Click "create workbook from template" in the Home tab.'
        },
        {
          icon: "Design",
          primaryText: "Search for a company in the Set-up tab then select the correct company from the options."
        },
        {
          icon: "Ribbon",
          primaryText: "Import the data, this should display the data in the dashboard."
        }
      ]
    });
  }

  /**
   * Creates a new workbook using the template file prototype.xlsm
   */
  loadTemplate = async () => {
    try {
      Excel.run(async function(context) {
        var templateFile = await (await fetch("/prototype.xlsm")).blob();
        var reader = new FileReader();
        reader.onload = function(_event) {
          Excel.run(function(context) {
            // strip off the metadata before the base64-encoded string
            var startIndex = reader.result.toString().indexOf("base64,");
            var workbookContents = reader.result.toString().substr(startIndex + 7);
            Excel.createWorkbook(workbookContents);
            return context.sync();
          }).catch(error => {
            console.error(error);
          });
        };

        // read in the file as a data URL so we can parse the base64-encoded string
        reader.readAsDataURL(templateFile);

        return context.sync();
      });
    } catch (error) {
      console.error(error);
    }
  };

  //side pannel main data, images etc
  render() {
    const { title, isOfficeInitialized } = this.props;
    const stackTokens: Partial<IStackTokens> = { childrenGap: 20, maxWidth: 250 };
    const searchBoxStyles: Partial<ISearchBoxStyles> = { root: { width: 250 } };
    const descriptionTextStyles: ITextStyles = {
      root: {
        color: "#333333",
        fontWeight: FontWeights.semibold
      }
    };

    const footerCardSectionStyles: ICardSectionStyles = {
      root: {
        borderTop: "1px solid #F3F2F1"
      }
    };

    const subduedTextStyles: ITextStyles = {
      root: {
        color: "#666666"
      }
    };

    const sectionStackTokens: IStackTokens = { childrenGap: 30 };
    const cardTokens: ICardTokens = { childrenMargin: 12 };
    const footerCardSectionTokens: ICardSectionTokens = { padding: "12px 0px 0px" };

    const agendaCardSectionTokens: ICardSectionTokens = { childrenGap: 0 };

    if (!isOfficeInitialized) {
      return (
        <Progress title={title} logo="assets/logo-filled.png" message="Please sideload your addin to see app body." />
      );
    }

    //Creates a menu bar on the top (Home, import, help), I've just added those for now, can change later.
    //This helps to separate the task pane into separate pages so the functionality isn't squashed into one place
    return (
      <div className="ms-welcome">
        {this.state.isSuccess && <this.SuccessNotify />}
        {this.state.isError && <this.ErrorNotify />}
        <Pivot>
          <PivotItem headerText="Home">
            <Header logo="assets/logo-filled.png" title={this.props.title} message="Welcome" />
            <Title message="Create a new worksheet to get started">
              <Button
                className="ms-welcome__action"
                buttonType={ButtonType.hero}
                iconProps={{ iconName: "ChevronRight" }}
                onClick={this.loadTemplate}
              >
                Create workbook from template
              </Button>
            </Title>
          </PivotItem>
          {/* Playing around with frontend */}
          <PivotItem headerText="Set-up">
            <br />
            <div className="center">
              <Pivot
                aria-label="Links of Large Tabs Pivot Example"
                linkFormat={PivotLinkFormat.tabs}
                // linkSize={PivotLinkSize.large}
              >
                <PivotItem headerText="Companies House">
                  <Title message="Search within Companies House">
                    <Stack tokens={stackTokens}>
                      <SearchBox
                        styles={searchBoxStyles}
                        placeholder="Company Name"
                        onSearch={this._showHouseResults.bind(null, true)}
                      />
                      <br />
                      {this.state.showHouseResults && "Search results for: " + this.state.companiesHouseName}
                      <br />
                      <Stack tokens={sectionStackTokens}>
                        {this.state.showHouseResults &&
                          this.state.companiesHouseList.map(element => (
                            <Card
                              key={element[1]}
                              aria-label="Clickable vertical card with image bleeding at the top of the card"
                              onClick={async () => {
                                try {
                                  let config = await loadConfig();
                                  config.house[0].companyNumber = element[1];
                                  saveConfig(config);
                                } catch (error) {
                                  console.error(error);
                                }
                              }}
                              tokens={cardTokens}
                            >
                              <Card.Section fill verticalAlign="end"></Card.Section>
                              <Card.Section>
                                <Text variant="small" styles={subduedTextStyles}>
                                  Companies House NZ
                                </Text>
                                <Text styles={descriptionTextStyles}>{element[0]}</Text>
                              </Card.Section>
                              <Card.Section tokens={agendaCardSectionTokens}>
                                <Text variant="small" styles={descriptionTextStyles}>
                                  {element[1]}
                                </Text>
                              </Card.Section>
                              <Card.Item grow={1}>
                                <span />
                              </Card.Item>
                              <Card.Section
                                horizontal
                                styles={footerCardSectionStyles}
                                tokens={footerCardSectionTokens}
                              ></Card.Section>
                            </Card>
                          ))}
                      </Stack>
                      <br />
                    </Stack>
                  </Title>
                </PivotItem>

                <PivotItem headerText="Google Trends">
                  <Title message="Search within Google Trends">
                    <Stack tokens={stackTokens}>
                      <SearchBox
                        styles={searchBoxStyles}
                        placeholder="Enter a query/keyword"
                        onSearch={this._showTrendsResults.bind(null, true)}
                      />
                      <br />
                      {this.state.showTrendsResults && "Search results for: " + this.state.googleTrendsName}
                    </Stack>
                  </Title>
                </PivotItem>

                <PivotItem headerText="Yahoo Finance">
                  <Title message="Search within Yahoo Finance">
                    <Stack tokens={stackTokens}>
                      <SearchBox
                        styles={searchBoxStyles}
                        placeholder="Company Name"
                        onSearch={this._showFinanceResults.bind(null, true)}
                      />
                      <br />
                      {this.state.showFinanceResults && "Search results for: " + this.state.yahooFinanceName}
                      <br />
                      <Stack tokens={sectionStackTokens}>
                        {this.state.showFinanceResults &&
                          this.state.yahooFinanceList.map(element => (
                            <Card
                              key={element}
                              aria-label="Clickable vertical card with image bleeding at the top of the card"
                              onClick={async () => {
                                try {
                                  let config = await loadConfig();
                                  config.finance[0].ticker = element;
                                  saveConfig(config);
                                } catch (error) {
                                  console.error(error);
                                }
                              }}
                              tokens={cardTokens}
                            >
                              <Card.Section fill verticalAlign="end"></Card.Section>
                              <Card.Section>
                                <Text variant="small" styles={subduedTextStyles}>
                                  Yahoo Finance
                                </Text>
                                <Text styles={descriptionTextStyles}>{element}</Text>
                              </Card.Section>
                              <Card.Item grow={1}>
                                <span />
                              </Card.Item>
                              <Card.Section
                                horizontal
                                styles={footerCardSectionStyles}
                                tokens={footerCardSectionTokens}
                              ></Card.Section>
                            </Card>
                          ))}
                      </Stack>
                      <br />
                    </Stack>
                  </Title>
                </PivotItem>

                <PivotItem headerText="LinkedIn">
                  <Title message="Search within LinkedIn">
                    <Stack tokens={stackTokens}>
                      <SearchBox
                        styles={searchBoxStyles}
                        placeholder="Company Name"
                        onSearch={this._showLinkedinResults.bind(null, true)}
                      />
                      <br />
                      {this.state.showLinkedinResults && "Search results for: " + this.state.linkedinName}
                    </Stack>
                  </Title>
                </PivotItem>
              </Pivot>
            </div>
          </PivotItem>

          <PivotItem headerText="Import">
            <Title message="Import data from...">
              <Button
                className="apiButton"
                buttonType={ButtonType.hero}
                iconProps={{ iconName: "ChevronRight" }}
                onClick={async () => {
                  try {
                    this.setState({ isLoading: true });
                    await populateHouse();
                    this.setState({ isLoading: false, isSuccess: true });
                  } catch (error) {
                    console.error(error);
                    this.setState({ isLoading: false, isError: true });
                  }
                }}
              >
                Companies House
              </Button>
              <br />
              <Button
                className="apiButton"
                buttonType={ButtonType.hero}
                iconProps={{ iconName: "ChevronRight" }}
                onClick={async () => {
                  try {
                    this.setState({ isLoading: true });
                    await populateTrends();
                    this.setState({ isLoading: false, isSuccess: true });
                  } catch (error) {
                    console.error(error);
                    this.setState({ isLoading: false, isError: true });
                  }
                }}
              >
                Google Trends
              </Button>
              <br />
              <Button
                className="apiButton"
                buttonType={ButtonType.hero}
                iconProps={{ iconName: "ChevronRight" }}
                onClick={async () => {
                  try {
                    this.setState({ isLoading: true });
                    await populateFinance();
                    this.setState({ isLoading: false, isSuccess: true });
                  } catch (error) {
                    console.error(error);
                    this.setState({ isLoading: false, isError: true });
                  }
                }}
              >
                Yahoo Finance
              </Button>
              <br />
              <Button
                className="apiButton"
                buttonType={ButtonType.hero}
                iconProps={{ iconName: "ChevronRight" }}
                onClick={async () => {
                  try {
                    this.setState({ isLoading: true });
                    await populateLinkedIn();
                    this.setState({ isLoading: false, isSuccess: true });
                  } catch (error) {
                    console.error(error);
                    this.setState({ isLoading: false, isError: true });
                  }
                }}
              >
                LinkedIn
              </Button>
              <br />
              {/*
              <Button
                className="apiButton"
                buttonType={ButtonType.hero}
                iconProps={{ iconName: "ChevronRight" }}
                onClick={() => {
                  try {
                    populateXero();
                  } catch (error) {
                    console.error(error);
                  }
                }}
              >
                Xero
              </Button>
              <br />
              <Button
                className="apiButton"
                buttonType={ButtonType.hero}
                iconProps={{ iconName: "ChevronRight" }}
                onClick={() => {
                  try {
                    populateFacebook();
                  } catch (error) {
                    console.error(error);
                  }
                }}
              >
                Facebook
              </Button>
              */}
            </Title>
          </PivotItem>
          <PivotItem headerText="Help">
            <HeroList
              message="Discover what Office Add-ins can do for you today!"
              items={this.state.listItems}
            ></HeroList>
          </PivotItem>
        </Pivot>
        {this.state.isLoading && <LoadingOverlay />}
      </div>
    );
  }
}
