import React, { Component } from "react";
import Image from "egov-ui-kit/components/Image";
import { connect } from "react-redux";
import get from "lodash/get";

class ImageList extends Component {
    render() {
        let styles = {
            imageGroup: {
                display: "flex",
                alignItems: "stretch",
                maxHeight: "154px",
                overflow: "hidden"
            },
            image: {
                height: "100%",
                objectFit: "cover",
                margin : "0 5px"
            },
        };
        const { data } = this.props;

        return (
            <div className="image-group" style={styles.imageGroup}>
                {data.length > 0
                    ? data.map((item, index) => {
                          return (
                              item.link !== undefined && (
                                //   <div style={styles.item}>
                                    
                                      <Image
                                          size="medium"
                                          width={200}
                                          height={154}
                                          className="image-item"
                                          style={styles.image}
                                          source={item.link}
                                      />
                                //   </div>
                              )
                          );
                      })
                    : "No Document Available."}
            </div>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    const { screenConfiguration } = state;

    const data = get(
        screenConfiguration.preparedFinalObject,
        ownProps.sourceJsonPath,
        []
    );
    return { data };
};

export default connect(mapStateToProps, null)(ImageList);
