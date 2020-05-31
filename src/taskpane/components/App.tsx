/**
 * @fileoverview controls the UI of the addin.
 * @package
 * @class AppProps
 * @class AppState
 * @class App
 */

import * as React from "react";
import {
  Overlay,
  Spinner,
  SpinnerSize,
  MessageBar,
  MessageBarType,
  Dialog,
  PrimaryButton,
  DialogFooter
} from "office-ui-fabric-react";
import { DefaultButton } from "office-ui-fabric-react";
import { Pivot, PivotItem } from "office-ui-fabric-react/lib/Pivot";
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
import { searchFinance, searchHouse, searchLinkedin } from "../sheets/api";
import {
  loadConfig,
  addHouseConfig,
  addFinanceConfig,
  addLinkedinConfig,
  removeHouseConfig,
  removeFinanceConfig,
  removeLinkedinConfig,
  removeTrendsConfig,
  addTrendsConfig
} from "../sheets/config";

export interface AppProps {
  title: string;
  isOfficeInitialized: boolean;
}

export interface AppState {
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  emptyHouseSearch: boolean;
  emptyFinanceSearch: boolean;
  emptyLinkedinSearch: boolean;
  emptyTrendsSearch: boolean;
  listItems: HeroListItem[];
  showHouseSearch: boolean;
  showFinanceSearch: boolean;
  showLinkedinSearch: boolean;
  showTrendsSearch: boolean;
  showHouseRows: boolean;
  showFinanceRows: boolean;
  showLinkedinRows: boolean;
  showTrendsRows: boolean;
  showHouseResults: boolean;
  showTrendsResults: boolean;
  showFinanceResults: boolean;
  showLinkedinResults: boolean;
  companiesHouseName: string;
  googleTrendsName: string;
  yahooFinanceName: string;
  linkedinName: string;
  companiesHouseList: any;
  yahooFinanceList: any;
  linkedInList: any;
  cNum: number;
  houseRows: any;
  yahooRows: any;
  linkedInRows: any;
  trendsRows: any;
  showHouseSetUp: boolean;
  showFinanceSetUp: boolean;
  showTrendsSetUp: boolean;
  showLinkedinSetUp: boolean;
}

export default class App extends React.Component<AppProps, AppState> {
  constructor(props, context) {
    super(props, context);
    this.state = {
      isLoading: false,
      isSuccess: false,
      isError: false,
      emptyHouseSearch: false,
      emptyFinanceSearch: false,
      emptyLinkedinSearch: false,
      emptyTrendsSearch: false,
      listItems: [],
      showHouseSearch: false,
      showFinanceSearch: false,
      showLinkedinSearch: false,
      showTrendsSearch: false,
      showHouseRows: false,
      showFinanceRows: false,
      showLinkedinRows: false,
      showTrendsRows: false,
      showHouseResults: false,
      showTrendsResults: false,
      showFinanceResults: false,
      showLinkedinResults: false,
      companiesHouseName: "",
      googleTrendsName: "",
      yahooFinanceName: "",
      linkedinName: "",
      companiesHouseList: [],
      yahooFinanceList: [],
      linkedInList: [],
      cNum: null,
      houseRows: [],
      yahooRows: [],
      linkedInRows: [],
      trendsRows: [],
      showHouseSetUp: false,
      showFinanceSetUp: false,
      showTrendsSetUp: false,
      showLinkedinSetUp: false
    };
  }

  LoadingOverlay = () => (
    <Overlay isDarkThemed={true} hidden={!this.state.isLoading}>
      <div className="center vertical">
        <Spinner size={SpinnerSize.large} />
      </div>
    </Overlay>
  );

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

  _showFinanceSearch = async bool => {
    this.setState({
      showFinanceRows: false,
      showFinanceSearch: bool,
      isSuccess: false,
      isError: false
    });
  };

  _showHouseSearch = async bool => {
    this.setState({
      showHouseRows: false,
      showHouseSearch: bool,
      isSuccess: false,
      isError: false
    });
  };

  _showLinkedinSearch = async bool => {
    this.setState({
      showLinkedinRows: false,
      showLinkedinSearch: bool,
      isSuccess: false,
      isError: false
    });
  };

  _showTrendsSearch = async bool => {
    this.setState({
      showTrendsRows: false,
      showTrendsSearch: bool,
      isSuccess: false,
      isError: false
    });
  };

  _showHouseRows = async bool => {
    this.setState({
      showHouseSearch: false,
      isError: false,
      isSuccess: false,
      showHouseRows: bool,
      houseRows: []
    });

    let temp = [];
    let config = await loadConfig();
    config.house.forEach((item, i) => {
      temp.push([i, item.companyName, item.companyNumber]);
    });
    this.setState({ houseRows: temp });
  };

  _showFinanceRows = async bool => {
    this.setState({
      showFinanceSearch: false,
      isSuccess: false,
      isError: false,
      showFinanceRows: bool,
      yahooRows: []
    });

    let temp = [];
    let config = await loadConfig();
    config.finance.forEach((item, i) => {
      temp.push([i, item.ticker]);
    });
    this.setState({ yahooRows: temp });
  };

  _showLinkedinRows = async bool => {
    this.setState({
      showLinkedinSearch: false,
      isSuccess: false,
      isError: false,
      showLinkedinRows: bool,
      linkedInRows: []
    });

    let temp = [];
    let config = await loadConfig();
    config.linkedin.forEach((item, i) => {
      temp.push([i, item.profileName]);
    });
    this.setState({ linkedInRows: temp });
  };

  _showTrendsRows = async bool => {
    this.setState({
      showTrendsSearch: false,
      isSuccess: false,
      isError: false,
      showTrendsRows: bool,
      trendsRows: []
    });

    let temp = [];
    let config = await loadConfig();
    config.trends.forEach((item, i) => {
      temp.push([i, item.keyword]);
    });
    this.setState({ trendsRows: temp });
  };

  _showHouseResults = async (bool, val) => {
    this.setState({
      isLoading: true,
      isError: false,
      isSuccess: false,
      showHouseSearch: true,
      showHouseSetUp: false,
      showHouseResults: bool,
      companiesHouseName: val
    });
    if (val.trim() == "") {
      this.setState({
        isError: true,
        isSuccess: false,
        showHouseResults: false,
        showHouseSetUp: true,
        isLoading: false,
        showHouseSearch: true
      });
    } else {
      this.setState({
        isError: false,
        isSuccess: false,
        companiesHouseList: (await searchHouse(val)).results,
        showHouseSearch: true,
        showHouseSetUp: true,
        isLoading: false
      });
    }
  };

  _showTrendsResults = async (bool, val) => {
    this.setState({
      isLoading: true,
      isError: false,
      isSuccess: false,
      emptyTrendsSearch: false,
      showTrendsSearch: false,
      showTrendsSetUp: false,
      showTrendsResults: bool,
      googleTrendsName: val
    });
    if (val.trim() == "") {
      this.setState({
        emptyTrendsSearch: true,
        isError: true,
        isSuccess: false,
        showTrendsSetUp: true,
        showTrendsResults: false,
        isLoading: false,
        showTrendsSearch: true
      });
    } else {
      addTrendsConfig({ keyword: val, weeks: 52 });
      this.setState({
        emptyTrendsSearch: false,
        isError: false,
        isSuccess: true,
        showTrendsSetUp: true,
        showTrendsSearch: true,
        isLoading: false
      });
    }
  };

  _showFinanceResults = async (bool, val) => {
    this.setState({
      isLoading: true,
      isError: false,
      isSuccess: false,
      emptyFinanceSearch: false,
      showFinanceSetUp: false,
      showFinanceSearch: false,
      showFinanceResults: bool,
      yahooFinanceName: val
    });

    if (val.trim() == "") {
      this.setState({
        emptyFinanceSearch: true,
        isError: true,
        isSuccess: false,
        showFinanceSetUp: true,
        showFinanceResults: false,
        isLoading: false,
        showFinanceSearch: true
      });
    } else {
      this.setState({
        emptyFinanceSearch: false,
        isError: false,
        showFinanceSetUp: true,
        isSuccess: false,
        yahooFinanceList: (await searchFinance(val)).results,
        showFinanceSearch: true,
        isLoading: false
      });
    }
  };

  _showLinkedinResults = async (bool, val) => {
    this.setState({
      isLoading: true,
      isError: false,
      isSuccess: false,
      emptyLinkedinSearch: false,
      showLinkedinSetUp: false,
      showLinkedinSearch: false,
      showLinkedinResults: bool,
      linkedinName: val
    });

    if (val.trim() == "") {
      this.setState({
        emptyLinkedinSearch: true,
        isError: true,
        isSuccess: false,
        showLinkedinResults: false,
        showLinkedinSetUp: true,
        isLoading: false,
        showLinkedinSearch: true
      });
    } else {
      this.setState({
        emptyLinkedinSearch: false,
        isError: false,
        isSuccess: false,
        showLinkedinSetUp: true,
        linkedInList: (await searchLinkedin(val)).results,
        showLinkedinSearch: true,
        isLoading: false
      });
    }
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
   * Creates a new workbook using the template file prototype.xlsx
   */
  loadTemplate = async () => {
    try {
      Excel.run(async function(context) {
        var templateFile = await (await fetch("/prototype.xlsx")).blob();
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

    return (
      <div className="ms-welcome">
        <Pivot>
          {/* Home */}
          <PivotItem headerText="Home">
            <Header logo="assets/logo-filled.png" title={this.props.title} message="Welcome" />
            <Title message="Create a new worksheet to get started">
              <DefaultButton
                className="homePageButtons"
                text="Create workbook from template"
                iconProps={{ iconName: "ChevronRight" }}
                onClick={this.loadTemplate}
              />
            </Title>
          </PivotItem>

          {/* Set-up */}
          <PivotItem headerText="Set-up">
            <Title message="Manage Your Data">
              <div className={"centerText"}>
                Choose a source and view/modify your current set-up and add more data to be imported!
              </div>
              <br />

              {/* Companies House */}
              <DefaultButton
                className="apiButton"
                text="Companies House NZ"
                iconProps={{ iconName: "ChevronRight" }}
                onClick={() => this.setState({ showHouseSetUp: true })}
              />
              <Dialog
                hidden={!this.state.showHouseSetUp}
                onDismiss={() =>
                  this.setState({
                    showHouseSetUp: false,
                    isSuccess: false,
                    isError: false
                  })
                }
                modalProps={{
                  onDismissed: () => {
                    if (!this.state.isLoading) {
                      this.setState({
                        showHouseSetUp: false,
                        isSuccess: false,
                        isError: false
                      });
                    }
                  }
                }}
              >
                {!this.state.showHouseSearch && this.state.isSuccess && <this.SuccessNotify />}
                {!this.state.showHouseSearch && this.state.isError && <this.ErrorNotify />}
                <div className={"centerText"}>
                  <Text className={"setUpHeaders"}>Companies House NZ</Text>
                </div>
                <br />
                <div className={"center"}>
                  <Stack tokens={stackTokens}>
                    <DefaultButton
                      className="configButton"
                      text="Show current set-up"
                      iconProps={{ iconName: "ChevronRight" }}
                      onClick={this._showHouseRows.bind(null, true)}
                    />
                    <DefaultButton
                      className="configButton"
                      text="Add another company"
                      iconProps={{ iconName: "ChevronRight" }}
                      onClick={() =>
                        this.setState({
                          showHouseSearch: true,
                          emptyHouseSearch: false,
                          isSuccess: false,
                          isError: false
                        })
                      }
                    />
                    <DefaultButton
                      className="configButton"
                      text="Import Companies House"
                      iconProps={{ iconName: "ChevronRight" }}
                      onClick={async () => {
                        try {
                          this.setState({ isLoading: true, showHouseSetUp: false });
                          await populateHouse();
                          this.setState({ isLoading: false, isSuccess: true, showHouseSetUp: true });
                        } catch (error) {
                          console.error(error);
                          this.setState({ isLoading: false, isError: true, showHouseSetUp: true });
                        }
                      }}
                    />
                  </Stack>
                </div>
                <Dialog
                  hidden={!this.state.showHouseRows}
                  onDismiss={() =>
                    this.setState({
                      showHouseRows: false,
                      isError: false,
                      isSuccess: false
                    })
                  }
                >
                  <div className={"centerText"}>
                    <Text className={"setUpHeaders"}>Current set-up</Text>
                  </div>
                  <br />
                  <Stack tokens={stackTokens}>
                    {this.state.showHouseRows &&
                      this.state.houseRows.map(element => (
                        <Card key={element} tokens={cardTokens}>
                          <Card.Section fill verticalAlign="end"></Card.Section>
                          <Card.Section>
                            <Text variant="small" styles={subduedTextStyles}>
                              Companies House NZ
                            </Text>
                            <Text variant="mediumPlus" styles={descriptionTextStyles}>
                              {element[1]}
                            </Text>
                          </Card.Section>
                          <Card.Section tokens={agendaCardSectionTokens}>
                            <Text variant="small" styles={descriptionTextStyles}>
                              {element[2]}
                            </Text>
                          </Card.Section>
                          <Card.Section tokens={agendaCardSectionTokens}>
                            <DefaultButton
                              className="removeButton"
                              onClick={async () => {
                                try {
                                  removeHouseConfig(element[0]);
                                  let temp = [];
                                  let config = await loadConfig();
                                  config.house.forEach((item, i) => {
                                    temp.push([i, item.companyName, item.companyNumber]);
                                  });
                                  this.setState({ houseRows: temp });
                                } catch (error) {
                                  console.error(error);
                                }
                              }}
                              text="Remove"
                            />
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
                  <DialogFooter className={"center"}>
                    <PrimaryButton
                      onClick={() =>
                        this.setState({
                          showHouseRows: false,
                          isError: false,
                          isSuccess: false
                        })
                      }
                      text="Back"
                    />
                  </DialogFooter>
                </Dialog>

                <Dialog
                  hidden={!this.state.showHouseSearch}
                  onDismiss={() =>
                    this.setState({
                      showHouseSearch: false,
                      isError: false,
                      isSuccess: false
                    })
                  }
                  modalProps={{
                    onDismissed: () => {
                      if (!this.state.isLoading) {
                        this.setState({
                          companiesHouseList: [],
                          showHouseResults: false,
                          isError: false,
                          isSuccess: false
                        });
                      }
                    }
                  }}
                >
                  {this.state.isSuccess && <this.SuccessNotify />}
                  {this.state.isError && <this.ErrorNotify />}
                  <div className={"centerText"}>
                    <Text className={"setUpHeaders"}>Search within Companies House NZ</Text>
                  </div>
                  <br />
                  <Stack tokens={stackTokens}>
                    <SearchBox
                      styles={searchBoxStyles}
                      placeholder="Company Name"
                      onSearch={this._showHouseResults.bind(null, true)}
                    />
                    <div className={"center"}>
                      <Stack tokens={sectionStackTokens}>
                        {this.state.showHouseResults &&
                          this.state.companiesHouseList.map(element => (
                            <Card
                              key={element[1]}
                              onClick={async () => {
                                try {
                                  addHouseConfig({ companyName: element[0], companyNumber: element[1] });
                                  this.setState({
                                    isSuccess: true,
                                    showHouseSearch: true,
                                    showHouseResults: false
                                  });
                                } catch (error) {
                                  console.error(error);
                                  this.setState({
                                    isSuccess: false,
                                    showHouseSearch: false
                                  });
                                }
                              }}
                              tokens={cardTokens}
                            >
                              <Card.Section fill verticalAlign="end"></Card.Section>
                              <Card.Section>
                                <Text variant="small" styles={subduedTextStyles}>
                                  Companies House NZ
                                </Text>
                                <Text variant="mediumPlus" styles={descriptionTextStyles}>
                                  {element[0]}
                                </Text>
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
                    </div>
                  </Stack>
                  <DialogFooter className={"center"}>
                    <PrimaryButton
                      onClick={() =>
                        this.setState({
                          showHouseSearch: false,
                          isError: false,
                          isSuccess: false
                        })
                      }
                      text="Back"
                    />
                  </DialogFooter>
                </Dialog>
                <DialogFooter className={"center"}>
                  <PrimaryButton
                    onClick={() =>
                      this.setState({
                        showHouseSetUp: false,
                        isError: false,
                        isSuccess: false
                      })
                    }
                    text="Close"
                  />
                </DialogFooter>
              </Dialog>
              <br />

              {/* Companies House UK */}
              <DefaultButton
                className="apiButton"
                disabled={true}
                text="Companies House UK"
                iconProps={{ iconName: "ChevronRight" }}
                // onClick={() => this.setState({ showHouseSetUp: true })}
              />
              <br />

              {/* Google Trends */}
              <DefaultButton
                className="apiButton"
                text="Google Trends"
                iconProps={{ iconName: "ChevronRight" }}
                onClick={() => this.setState({ showTrendsSetUp: true })}
              />
              <br />
              <Dialog
                hidden={!this.state.showTrendsSetUp}
                onDismiss={() =>
                  this.setState({
                    showTrendsSetUp: false,
                    isSuccess: false,
                    isError: false
                  })
                }
                modalProps={{
                  onDismissed: () => {
                    if (!this.state.isLoading) {
                      this.setState({
                        showTrendsSetUp: false,
                        isSuccess: false,
                        isError: false
                      });
                    }
                  }
                }}
              >
                {!this.state.showTrendsSearch && this.state.isSuccess && <this.SuccessNotify />}
                {!this.state.showTrendsSearch && this.state.isError && <this.ErrorNotify />}
                <div className={"centerText"}>
                  <Text className={"setUpHeaders"}>Google Trends</Text>
                </div>
                <br />
                <div className={"center"}>
                  <Stack tokens={stackTokens}>
                    <DefaultButton
                      className="configButton"
                      text="Show current set-up"
                      iconProps={{ iconName: "ChevronRight" }}
                      onClick={this._showTrendsRows.bind(null, true)}
                    />
                    <DefaultButton
                      className="configButton"
                      text="Enter a keyword"
                      iconProps={{ iconName: "ChevronRight" }}
                      onClick={() =>
                        this.setState({
                          showTrendsSearch: true,
                          emptyTrendsSearch: false,
                          isSuccess: false,
                          isError: false
                        })
                      }
                    />
                    <DefaultButton
                      className="configButton"
                      text="Import Google Trends"
                      iconProps={{ iconName: "ChevronRight" }}
                      onClick={async () => {
                        try {
                          this.setState({ isLoading: true, showTrendsSetUp: false });
                          await populateTrends();
                          this.setState({ isLoading: false, isSuccess: true, showTrendsSetUp: true });
                        } catch (error) {
                          console.error(error);
                          this.setState({ isLoading: false, isError: true, showTrendsSetUp: true });
                        }
                      }}
                    />
                  </Stack>
                </div>
                <Dialog
                  hidden={!this.state.showTrendsRows}
                  onDismiss={() =>
                    this.setState({
                      showTrendsRows: false,
                      isError: false,
                      isSuccess: false
                    })
                  }
                >
                  <div className={"centerText"}>
                    <Text className={"setUpHeaders"}>Current set-up</Text>
                  </div>
                  <br />
                  <Stack tokens={stackTokens}>
                    {this.state.showTrendsRows &&
                      this.state.trendsRows.map(element => (
                        <Card key={element} tokens={cardTokens}>
                          <Card.Section fill verticalAlign="end"></Card.Section>
                          <Card.Section>
                            <Text variant="small" styles={subduedTextStyles}>
                              Google Trends
                            </Text>
                            <Text variant="mediumPlus" styles={descriptionTextStyles}>
                              {element[1]}
                            </Text>
                          </Card.Section>
                          <Card.Section tokens={agendaCardSectionTokens}>
                            <DefaultButton
                              className="removeButton"
                              onClick={async () => {
                                try {
                                  removeTrendsConfig(element[0]);
                                  let temp = [];
                                  let config = await loadConfig();
                                  config.trends.forEach((item, i) => {
                                    temp.push([i, item.keyword]);
                                  });
                                  this.setState({ trendsRows: temp });
                                } catch (error) {
                                  console.error(error);
                                }
                              }}
                              text="Remove"
                            />
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
                  <DialogFooter className={"center"}>
                    <PrimaryButton
                      onClick={() =>
                        this.setState({
                          showTrendsRows: false,
                          isSuccess: false,
                          isError: false
                        })
                      }
                      text="Back"
                    />
                  </DialogFooter>
                </Dialog>

                <Dialog
                  hidden={!this.state.showTrendsSearch}
                  onDismiss={() =>
                    this.setState({
                      showTrendsSearch: false,
                      isError: false,
                      isSuccess: false
                    })
                  }
                  modalProps={{
                    onDismissed: () => {
                      if (!this.state.isLoading) {
                        this.setState({
                          showTrendsResults: false,
                          isError: false,
                          isSuccess: false
                        });
                      }
                    }
                  }}
                >
                  {this.state.isSuccess && <this.SuccessNotify />}
                  {this.state.isError && <this.ErrorNotify />}
                  <div className={"centerText"}>
                    <Text className={"setUpHeaders"}>Enter a keyword for Google Trends</Text>
                  </div>
                  <br />
                  <Stack tokens={stackTokens}>
                    <SearchBox
                      styles={searchBoxStyles}
                      placeholder="Keyword"
                      onSearch={this._showTrendsResults.bind(null, true)}
                    />
                  </Stack>
                  <DialogFooter className={"center"}>
                    <PrimaryButton
                      onClick={() =>
                        this.setState({
                          showTrendsSearch: false,
                          isError: false,
                          isSuccess: false
                        })
                      }
                      text="Back"
                    />
                  </DialogFooter>
                </Dialog>
                <DialogFooter className={"center"}>
                  <PrimaryButton
                    onClick={() =>
                      this.setState({
                        showTrendsSetUp: false,
                        isError: false,
                        isSuccess: false
                      })
                    }
                    text="Close"
                  />
                </DialogFooter>
              </Dialog>

              {/* Yahoo Finance */}
              <DefaultButton
                className="apiButton"
                text="Yahoo Finance"
                iconProps={{ iconName: "ChevronRight" }}
                onClick={() => this.setState({ showFinanceSetUp: true })}
              />
              <Dialog
                hidden={!this.state.showFinanceSetUp}
                onDismiss={() =>
                  this.setState({
                    showFinanceSetUp: false,
                    isSuccess: false,
                    isError: false
                  })
                }
                modalProps={{
                  onDismissed: () => {
                    if (!this.state.isLoading) {
                      this.setState({
                        showFinanceSetUp: false,
                        isSuccess: false,
                        isError: false
                      });
                    }
                  }
                }}
              >
                {!this.state.showFinanceSearch && this.state.isSuccess && <this.SuccessNotify />}
                {!this.state.showFinanceSearch && this.state.isError && <this.ErrorNotify />}
                <div className={"centerText"}>
                  <Text className={"setUpHeaders"}>Yahoo Finance</Text>
                </div>
                <br />
                <div className={"center"}>
                  <Stack tokens={stackTokens}>
                    <DefaultButton
                      className="configButton"
                      text="Show current set-up"
                      iconProps={{ iconName: "ChevronRight" }}
                      onClick={this._showFinanceRows.bind(null, true)}
                    />
                    <DefaultButton
                      className="configButton"
                      text="Add another company"
                      iconProps={{ iconName: "ChevronRight" }}
                      onClick={() =>
                        this.setState({
                          showFinanceSearch: true,
                          emptyFinanceSearch: false,
                          isSuccess: false,
                          isError: false
                        })
                      }
                    />
                    <DefaultButton
                      className="configButton"
                      text="Import Yahoo Finance"
                      iconProps={{ iconName: "ChevronRight" }}
                      onClick={async () => {
                        try {
                          this.setState({ isLoading: true, showFinanceSetUp: false });
                          await populateFinance();
                          this.setState({ isLoading: false, isSuccess: true, showFinanceSetUp: true });
                        } catch (error) {
                          console.error(error);
                          this.setState({ isLoading: false, isError: true, showFinanceSetUp: true });
                        }
                      }}
                    />
                  </Stack>
                </div>
                <Dialog
                  hidden={!this.state.showFinanceRows}
                  onDismiss={() =>
                    this.setState({
                      showFinanceRows: false,
                      isError: false,
                      isSuccess: false
                    })
                  }
                >
                  <div className={"centerText"}>
                    <Text className={"setUpHeaders"}>Current set-up</Text>
                  </div>
                  <br />
                  <Stack tokens={stackTokens}>
                    {this.state.showFinanceRows &&
                      this.state.yahooRows.map(element => (
                        <Card key={element} tokens={cardTokens}>
                          <Card.Section fill verticalAlign="end"></Card.Section>
                          <Card.Section>
                            <Text variant="small" styles={subduedTextStyles}>
                              Yahoo Finance
                            </Text>
                            <Text variant="mediumPlus" styles={descriptionTextStyles}>
                              {element[1]}
                            </Text>
                          </Card.Section>
                          <Card.Section tokens={agendaCardSectionTokens}>
                            <DefaultButton
                              className="removeButton"
                              onClick={async () => {
                                try {
                                  removeFinanceConfig(element[0]);
                                  let temp = [];
                                  let config = await loadConfig();
                                  config.finance.forEach((item, i) => {
                                    temp.push([i, item.ticker]);
                                  });
                                  this.setState({ yahooRows: temp });
                                } catch (error) {
                                  console.error(error);
                                }
                              }}
                              text="Remove"
                            />
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
                  <DialogFooter className={"center"}>
                    <PrimaryButton
                      onClick={() =>
                        this.setState({
                          showFinanceRows: false,
                          isError: false,
                          isSuccess: false
                        })
                      }
                      text="Back"
                    />
                  </DialogFooter>
                </Dialog>

                <Dialog
                  hidden={!this.state.showFinanceSearch}
                  onDismiss={() =>
                    this.setState({
                      showFinanceSearch: false,
                      isError: false,
                      isSuccess: false
                    })
                  }
                  modalProps={{
                    onDismissed: () => {
                      if (!this.state.isLoading) {
                        this.setState({
                          yahooFinanceList: [],
                          showFinanceResults: false,
                          isError: false,
                          isSuccess: false
                        });
                      }
                    }
                  }}
                >
                  {this.state.isSuccess && <this.SuccessNotify />}
                  {this.state.isError && <this.ErrorNotify />}
                  <div className={"centerText"}>
                    <Text className={"setUpHeaders"}>Search within Yahoo Finance</Text>
                  </div>
                  <br />
                  <Stack tokens={stackTokens}>
                    <SearchBox
                      styles={searchBoxStyles}
                      placeholder="Company Name"
                      onSearch={this._showFinanceResults.bind(null, true)}
                    />
                    <div className={"center"}>
                      <Stack tokens={sectionStackTokens}>
                        {this.state.showFinanceResults &&
                          this.state.yahooFinanceList.map(element => (
                            <Card
                              key={element[1]}
                              onClick={async () => {
                                try {
                                  addFinanceConfig({ ticker: element, interval: "1d", range: "1y" });
                                  this.setState({
                                    isSuccess: true,
                                    showFinanceSearch: true,
                                    showFinanceResults: false
                                  });
                                } catch (error) {
                                  console.error(error);
                                  this.setState({
                                    isSuccess: false,
                                    showFinanceSearch: false
                                  });
                                }
                              }}
                              tokens={cardTokens}
                            >
                              <Card.Section fill verticalAlign="end"></Card.Section>
                              <Card.Section>
                                <Text variant="small" styles={subduedTextStyles}>
                                  Yahoo Finance
                                </Text>
                                <Text variant="mediumPlus" styles={descriptionTextStyles}>
                                  {element}
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
                    </div>
                  </Stack>
                  <DialogFooter className={"center"}>
                    <PrimaryButton
                      onClick={() =>
                        this.setState({
                          showFinanceSearch: false,
                          isError: false,
                          isSuccess: false
                        })
                      }
                      text="Back"
                    />
                  </DialogFooter>
                </Dialog>
                <DialogFooter className={"center"}>
                  <PrimaryButton
                    onClick={() =>
                      this.setState({
                        showFinanceSetUp: false,
                        isError: false,
                        isSuccess: false
                      })
                    }
                    text="Close"
                  />
                </DialogFooter>
              </Dialog>
              <br />

              {/* LinkedIn */}
              <DefaultButton
                className="apiButton"
                text="LinkedIn"
                iconProps={{ iconName: "ChevronRight" }}
                onClick={() => this.setState({ showLinkedinSetUp: true })}
              />
              <Dialog
                hidden={!this.state.showLinkedinSetUp}
                onDismiss={() =>
                  this.setState({
                    showLinkedinSetUp: false,
                    isSuccess: false,
                    isError: false
                  })
                }
                modalProps={{
                  onDismissed: () => {
                    if (!this.state.isLoading) {
                      this.setState({
                        showLinkedinSetUp: false,
                        isSuccess: false,
                        isError: false
                      });
                    }
                  }
                }}
              >
                {!this.state.showLinkedinSearch && this.state.isSuccess && <this.SuccessNotify />}
                {!this.state.showLinkedinSearch && this.state.isError && <this.ErrorNotify />}
                <div className={"centerText"}>
                  <Text className={"setUpHeaders"}>LinkedIn</Text>
                </div>
                <br />
                <div className={"center"}>
                  <Stack tokens={stackTokens}>
                    <DefaultButton
                      className="configButton"
                      text="Show current set-up"
                      iconProps={{ iconName: "ChevronRight" }}
                      onClick={this._showLinkedinRows.bind(null, true)}
                    />
                    <DefaultButton
                      className="configButton"
                      text="Add another profile"
                      iconProps={{ iconName: "ChevronRight" }}
                      onClick={() =>
                        this.setState({
                          showLinkedinSearch: true,
                          emptyLinkedinSearch: false,
                          isSuccess: false,
                          isError: false
                        })
                      }
                    />
                    <DefaultButton
                      className="configButton"
                      text="Import LinkedIn"
                      iconProps={{ iconName: "ChevronRight" }}
                      onClick={async () => {
                        try {
                          this.setState({ isLoading: true, showLinkedinSetUp: false });
                          await populateLinkedIn();
                          this.setState({ isLoading: false, isSuccess: true, showLinkedinSetUp: true });
                        } catch (error) {
                          console.error(error);
                          this.setState({ isLoading: false, isError: true, showLinkedinSetUp: true });
                        }
                      }}
                    />
                  </Stack>
                </div>
                <Dialog
                  hidden={!this.state.showLinkedinRows}
                  onDismiss={() =>
                    this.setState({
                      showLinkedinRows: false,
                      isError: false,
                      isSuccess: false
                    })
                  }
                >
                  <div className={"centerText"}>
                    <Text className={"setUpHeaders"}>Current set-up</Text>
                  </div>
                  <br />
                  <Stack tokens={stackTokens}>
                    {this.state.showLinkedinRows &&
                      this.state.linkedInRows.map(element => (
                        <Card key={element} tokens={cardTokens}>
                          <Card.Section fill verticalAlign="end"></Card.Section>
                          <Card.Section>
                            <Text variant="small" styles={subduedTextStyles}>
                              LinkedIn
                            </Text>
                            <Text variant="mediumPlus" styles={descriptionTextStyles}>
                              {element[1]}
                            </Text>
                          </Card.Section>
                          <Card.Section tokens={agendaCardSectionTokens}>
                            <DefaultButton
                              className="removeButton"
                              onClick={async () => {
                                try {
                                  removeLinkedinConfig(element[0]);
                                  let temp = [];
                                  let config = await loadConfig();
                                  config.linkedin.forEach((item, i) => {
                                    temp.push([i, item.profileName]);
                                  });
                                  this.setState({ linkedInRows: temp });
                                } catch (error) {
                                  console.error(error);
                                }
                              }}
                              text="Remove"
                            />
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
                  <DialogFooter className={"center"}>
                    <PrimaryButton
                      onClick={() =>
                        this.setState({
                          showLinkedinRows: false,
                          isError: false,
                          isSuccess: false
                        })
                      }
                      text="Back"
                    />
                  </DialogFooter>
                </Dialog>

                <Dialog
                  hidden={!this.state.showLinkedinSearch}
                  onDismiss={() =>
                    this.setState({
                      showLinkedinSearch: false,
                      isError: false,
                      isSuccess: false
                    })
                  }
                  modalProps={{
                    onDismissed: () => {
                      if (!this.state.isLoading) {
                        this.setState({
                          linkedInList: [],
                          showLinkedinResults: false,
                          isError: false,
                          isSuccess: false
                        });
                      }
                    }
                  }}
                >
                  {this.state.isSuccess && <this.SuccessNotify />}
                  {this.state.isError && <this.ErrorNotify />}
                  <div className={"centerText"}>
                    <Text className={"setUpHeaders"}>Search within LinkedIn</Text>
                  </div>
                  <br />
                  <Stack tokens={stackTokens}>
                    <SearchBox
                      styles={searchBoxStyles}
                      placeholder="Company profile name"
                      onSearch={this._showLinkedinResults.bind(null, true)}
                    />
                    <div className={"center"}>
                      <Stack tokens={sectionStackTokens}>
                        {this.state.showLinkedinResults &&
                          this.state.linkedInList.map(element => (
                            <Card
                              key={element[1]}
                              onClick={async () => {
                                try {
                                  addLinkedinConfig({ profileName: element });
                                  this.setState({
                                    isSuccess: true,
                                    showLinkedinSearch: true,
                                    showLinkedinResults: false
                                  });
                                } catch (error) {
                                  console.error(error);
                                  this.setState({
                                    isSuccess: false,
                                    showLinkedinSearch: false
                                  });
                                }
                              }}
                              tokens={cardTokens}
                            >
                              <Card.Section fill verticalAlign="end"></Card.Section>
                              <Card.Section>
                                <Text variant="small" styles={subduedTextStyles}>
                                  LinkedIn
                                </Text>
                                <Text variant="mediumPlus" styles={descriptionTextStyles}>
                                  {element}
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
                    </div>
                  </Stack>
                  <DialogFooter className={"center"}>
                    <PrimaryButton
                      onClick={() =>
                        this.setState({
                          showLinkedinSearch: false,
                          isError: false,
                          isSuccess: false
                        })
                      }
                      text="Back"
                    />
                  </DialogFooter>
                </Dialog>
                <DialogFooter className={"center"}>
                  <PrimaryButton
                    onClick={() =>
                      this.setState({
                        showLinkedinSetUp: false,
                        isError: false,
                        isSuccess: false
                      })
                    }
                    text="Close"
                  />
                </DialogFooter>
              </Dialog>
            </Title>
          </PivotItem>

          {/* Help */}
          <PivotItem headerText="Help">
            <HeroList message="Follow the steps below to get started!" items={this.state.listItems}></HeroList>
          </PivotItem>
        </Pivot>
        <this.LoadingOverlay />
      </div>
    );
  }
}
